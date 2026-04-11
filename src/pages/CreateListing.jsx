import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import ListingAdForm from "../components/ListingAdForm";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import { addDoc, serverTimestamp, collection } from "firebase/firestore";
import { useFileListPreviews } from "../hooks/useFileListPreviews";
import { MAX_LISTING_IMAGES } from "../constants/listings";
import { isOfferDiscountInvalid } from "../utils/offerPriceValidation";

const CreateListing = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const imagesInputRef = useRef(null);
  const [imagesOverLimit, setImagesOverLimit] = useState(false);

  const [formData, SetFormData] = useState({
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
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        SetFormData({ ...formData, userRef: user.uid });
      } else {
        navigate("/sign-in");
      }
    });

    return unsub;
    // eslint-disable-next-line
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (offer && isOfferDiscountInvalid(regularPrice, discountedPrice)) {
      setLoading(false);
      toast.error("Discounted Price needs to be less than regular Price");
      return;
    }
    if (!Array.isArray(images) || !images.length) {
      setLoading(false);
      toast.error("Please choose at least one image");
      return;
    }
    if (images.length > MAX_LISTING_IMAGES) {
      setLoading(false);
      toast.error(
        `Maximum ${MAX_LISTING_IMAGES} images per listing (up to 2 MB each).`
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
          () => {},
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

    const imageUrls = await Promise.all(
      images.map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images could not upload,max size 2Mb or less");
      return;
    });

    const formDataCopy = {
      ...formData,
      imageUrls,
      timestamp: serverTimestamp(),
      description: String(formData.description ?? "").trim(),
    };
    delete formDataCopy.images;
    !formData.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);

    toast.success("Advertisement saved");
    navigate(`/category/${formData.type}/${docRef.id}`);
    setLoading(false);
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
      if (picked.length > MAX_LISTING_IMAGES) {
        toast.warn(
          `Maximum ${MAX_LISTING_IMAGES} images. Only the first ${MAX_LISTING_IMAGES} were added.`
        );
        setImagesOverLimit(true);
        SetFormData((prevState) => ({
          ...prevState,
          images: picked.slice(0, MAX_LISTING_IMAGES),
        }));
      } else {
        setImagesOverLimit(false);
        SetFormData((prevState) => ({
          ...prevState,
          images: picked,
        }));
      }
    }
    if (!e.target.files) {
      const key = e.target.id || e.target.name;
      if (!key) return;
      SetFormData((prevState) => ({
        ...prevState,
        [key]: boolean ?? e.target.value,
      }));
    }
  };

  const imageList = Array.isArray(images) ? images : [];
  const pendingImageCount = imageList.length;
  const imagePreviewUrls = useFileListPreviews(
    pendingImageCount > 0 ? imageList : null
  );

  useEffect(() => {
    if (pendingImageCount === 0 && imagesInputRef.current) {
      imagesInputRef.current.value = "";
    }
    if (pendingImageCount < MAX_LISTING_IMAGES) {
      setImagesOverLimit(false);
    }
  }, [pendingImageCount]);

  const removePendingImage = (index) => {
    SetFormData((prev) => {
      const list = Array.isArray(prev.images) ? prev.images : [];
      return { ...prev, images: list.filter((_, i) => i !== index) };
    });
  };

  if (loading) return <Spinner />;

  return (
    <ListingAdForm
      ariaPrefix="create"
      pageTitle="Create Advertising"
      pageLead="Add clear photos and accurate details — buyers notice listings that feel complete and honest."
      submitLabel="Create advertisement"
      submitHint="You can edit or remove the listing later from your profile."
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
        mode: "create",
        inputRef: imagesInputRef,
        overLimit: imagesOverLimit,
        pendingCount: pendingImageCount,
        previewUrls: imagePreviewUrls,
        onRemovePending: removePendingImage,
      }}
    />
  );
};

export default CreateListing;
