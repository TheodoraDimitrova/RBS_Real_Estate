import { useState, useEffect, useRef } from "react";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import ListingAdForm from "../components/ListingAdForm";
import { toast } from "react-toastify";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useFileListPreviews } from "../hooks/useFileListPreviews";
import { MAX_LISTING_IMAGES } from "../constants/listings";

function EditAd() {
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const imagesInputRef = useRef(null);
  const imageUrlsRef = useRef([]);
  const [newImagesOverLimit, setNewImagesOverLimit] = useState(false);

  useEffect(() => {
    imageUrlsRef.current = imageUrls;
  }, [imageUrls]);

  const [formData, setFormData] = useState({
    type: "sell",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    imageUrls: [],
    images: [],
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    offer,
    regularPrice,
    discountedPrice,
    images,
    parking,
    furnished,
    address,
    description,
  } = formData;

  useEffect(() => {
    const fetchAd = async () => {
      const docRef = doc(db, "listings", params.adId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData(data);
        setImageUrls(Array.isArray(data.imageUrls) ? data.imageUrls : []);
        setLoading(false);
      }
    };

    fetchAd();
  }, [params.adId]);

  const deleteSingleImage = async (e) => {
    if (window.confirm("Are you sure you want to remove the image?")) {
      const delFromStore = async () => {
        let urlImage = e.target.id;
        const storage = getStorage();
        const desertRef = ref(storage, `${urlImage}`);
        try {
          await deleteObject(desertRef);
        } catch (error) {
          console.log(error);
        }
      };
      await delFromStore();
      const arrayRemove = (url) => {
        let filtered = imageUrls.filter((img) => img !== url);
        return filtered;
      };
      await updateDoc(doc(db, "listings", params.adId), {
        imageUrls: arrayRemove(e.target.id),
      });
      const updatedImages = imageUrls.filter((url) => url !== e.target.id);
      setImageUrls(updatedImages);
      toast.success("Successfully removed image");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (offer) {
      const reg = Number(regularPrice);
      const disc = Number(discountedPrice);
      if (Number.isFinite(reg) && Number.isFinite(disc) && disc >= reg) {
        setLoading(false);
        toast.error("Discounted Price needs to be less than regular Price");
        return;
      }
    }

    if (Array.isArray(images) && images.length > 0) {
      if (imageUrls.length + images.length > MAX_LISTING_IMAGES) {
        setLoading(false);
        toast.error(
          `Maximum ${MAX_LISTING_IMAGES} images per listing in total.`
        );
        return;
      }

      const storeImage = async (image) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const fileName = `${image.name}`;

          const storageRef = ref(storage, "images/" + fileName);
          const uploadTask = uploadBytesResumable(storageRef, image);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              //eslint-disable-next-line
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      };

      const urls = await Promise.all(
        images.map((image) => storeImage(image))
      ).catch(() => {
        setLoading(false);
        toast.error("Images could not upload,max size 2Mb or less");
        return;
      });
      const formDataCopy = {
        ...formData,
        imageUrls: [...urls, ...imageUrls],
        description: String(formData.description ?? "").trim(),
      };
      delete formDataCopy.images;
      !formData.offer && delete formDataCopy.discountedPrice;

      const adRef = doc(db, "listings", params.adId);
      await updateDoc(adRef, formDataCopy);
      toast.success("Advertisement edited");
      navigate(`/category/${formData.type}/${adRef.id}`);
      setLoading(false);
    } else {
      const formDataCopy = {
        ...formData,
        imageUrls: imageUrls,
        description: String(formData.description ?? "").trim(),
      };
      delete formDataCopy.images;
      !formData.offer && delete formDataCopy.discountedPrice;

      const adRef = doc(db, "listings", params.adId);
      await updateDoc(adRef, formDataCopy);
      toast.success("Advertisement edited");
      navigate(`/category/${formData.type}/${adRef.id}`);
      setLoading(false);
    }
  };

  const onTransform = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      const picked = Array.from(e.target.files);
      const published = Array.isArray(imageUrlsRef.current)
        ? imageUrlsRef.current.length
        : 0;
      const remaining = Math.max(0, MAX_LISTING_IMAGES - published);

      if (remaining === 0) {
        toast.error(
          `This listing already has the maximum of ${MAX_LISTING_IMAGES} images. Remove some before adding new ones.`
        );
        e.target.value = "";
        setNewImagesOverLimit(false);
        setFormData((prevState) => ({ ...prevState, images: [] }));
        return;
      }

      if (picked.length > remaining) {
        toast.warn(
          `You can add up to ${remaining} more image(s) (${MAX_LISTING_IMAGES} total). Extra files were not added.`
        );
        setNewImagesOverLimit(true);
        setFormData((prevState) => ({
          ...prevState,
          images: picked.slice(0, remaining),
        }));
      } else {
        setNewImagesOverLimit(false);
        setFormData((prevState) => ({
          ...prevState,
          images: picked,
        }));
      }
    }
    if (!e.target.files) {
      const key = e.target.id || e.target.name;
      if (!key) return;
      setFormData((prevState) => ({
        ...prevState,
        [key]: boolean ?? e.target.value,
      }));
    }
  };

  const newImageList = Array.isArray(images) ? images : [];
  const newImageCount = newImageList.length;
  const newImagePreviewUrls = useFileListPreviews(
    newImageCount > 0 ? newImageList : null
  );

  useEffect(() => {
    const published = Array.isArray(imageUrls) ? imageUrls.length : 0;
    if (newImageCount === 0 && imagesInputRef.current) {
      imagesInputRef.current.value = "";
    }
    if (published + newImageCount < MAX_LISTING_IMAGES) {
      setNewImagesOverLimit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- imageUrls.length only; avoid resetting on array identity churn
  }, [newImageCount, imageUrls.length]);

  const removePendingImage = (index) => {
    setFormData((prev) => {
      const list = Array.isArray(prev.images) ? prev.images : [];
      return { ...prev, images: list.filter((_, i) => i !== index) };
    });
  };

  if (loading) return <Spinner />;

  const canAddMore = Math.max(0, MAX_LISTING_IMAGES - imageUrls.length);

  return (
    <ListingAdForm
      ariaPrefix="edit"
      pageTitle="Edit advertisement"
      pageLead={`Update details, prices, or add photos — up to ${MAX_LISTING_IMAGES} images total (max 2 MB each).`}
      submitLabel="Save changes"
      submitHint="Updates apply immediately on the listing page."
      onSubmit={onSubmit}
      onFieldChange={onTransform}
      values={{
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        description,
        offer,
        regularPrice,
        discountedPrice,
      }}
      images={{
        mode: "edit",
        inputRef: imagesInputRef,
        overLimit: newImagesOverLimit,
        pendingCount: newImageCount,
        previewUrls: newImagePreviewUrls,
        onRemovePending: removePendingImage,
        publishedUrls: imageUrls,
        onDeletePublished: deleteSingleImage,
        canAddMore,
      }}
    />
  );
}

export default EditAd;
