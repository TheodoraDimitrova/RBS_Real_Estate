import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import { v4 } from "uuid";

function CreateListing() {
  const [loading, SetLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const [formData, SetFormData] = useState({
    type: "sell",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
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
  } = formData;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user", user);
        SetFormData({ ...formData, useRef: user.uid });
      } else {
        navigate("/sign-in");
      }
    });

    return unsub; //cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    // eslint-disable-next-line
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    SetLoading(true);
    if (discountedPrice >= regularPrice) {
      SetLoading(false);
      toast.error("Discounted Price needs to be less than regular Price");
      return;
    }
    if (images.maxLength > 6) {
      SetLoading(false);
      toast.error("Max 6 images");
      return;
    }
    console.log("submit", formData);
    //store images in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${v4()}`;

        const storageRef = ref(storage, "images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
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

    const imageUrls = await Promise.all(
      // array of images urls
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      SetLoading(false);
      toast.error("Images not uploading");
      return;
    });

    console.log(imageUrls);

    SetLoading(false);
  };
  const onTransform = (e) => {
    console.log("onTransform btn");
    let boolean = null; //check if is boolean
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      //if is files
      SetFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // text,boolean, numbers
    if (!e.target.files) {
      SetFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create Advertising</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label htmlFor="formLabel">Sell / Rent</label>
          <div className="formButtons">
            <button
              id="type"
              type="button"
              value="sell"
              onClick={onTransform}
              className={
                type === "sell" ? "formButtonActive btn-grad" : "formButton"
              }
            >
              Sell
            </button>
            <button
              id="type"
              type="button"
              value="rent"
              onClick={onTransform}
              className={
                type === "rent" ? "formButtonActive btn-grad" : "formButton"
              }
            >
              Rent
            </button>
          </div>
          <label htmlFor="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            maxLength="32"
            minLength="10"
            required="required"
            onChange={onTransform}
          />
          <div className="formRooms flex">
            <div>
              <label htmlFor="formLabel">Bedrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bedrooms"
                value={bedrooms}
                min="1"
                max="10"
                required="required"
                onChange={onTransform}
              />
            </div>
            <div>
              <label htmlFor="formLabel">Bathrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bathrooms"
                value={bathrooms}
                min="1"
                max="10"
                required="required"
                onChange={onTransform}
              />
            </div>
          </div>

          <label htmlFor="formLabel">Parking Spots</label>
          <div className="formButtons">
            <button
              id="parking"
              type="button"
              value={true}
              onClick={onTransform}
              className={parking ? "formButtonActive btn-grad" : "formButton"}
            >
              Yes
            </button>
            <button
              id="parking"
              type="button"
              value={false}
              onClick={onTransform}
              className={
                !parking && parking !== null
                  ? "formButtonActive btn-grad"
                  : "formButton"
              }
            >
              No
            </button>
          </div>
          {/* furnished */}
          <label htmlFor="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              id="furnished"
              type="button"
              value={true}
              onClick={onTransform}
              className={furnished ? "formButtonActive btn-grad" : "formButton"}
            >
              Yes
            </button>
            <button
              id="furnished"
              type="button"
              value={false}
              onClick={onTransform}
              className={
                !furnished && furnished !== null
                  ? "formButtonActive btn-grad"
                  : "formButton"
              }
            >
              No
            </button>
          </div>
          {/* address */}
          <label htmlFor="formLabel">Address</label>
          <input
            className="formInputName"
            type="text"
            id="address"
            value={address}
            required="required"
            onChange={onTransform}
          />

          {/* Offer */}
          <label htmlFor="formLabel">Offer</label>
          <div className="formButtons">
            <button
              id="offer"
              type="button"
              value={true}
              onClick={onTransform}
              className={offer ? "formButtonActive btn-grad" : "formButton "}
            >
              Yes
            </button>
            <button
              id="offer"
              type="button"
              value={false}
              onClick={onTransform}
              className={
                !offer && offer !== null
                  ? "formButtonActive btn-grad"
                  : "formButton "
              }
            >
              No
            </button>
          </div>

          <div>
            <label htmlFor="formLabel">Regular Price</label>
            <div className="formPriceDiv">
              <input
                className="formInputSmall"
                type="number"
                id="regularPrice"
                min="100"
                max="10000000"
                value={regularPrice}
                required="required"
                onChange={onTransform}
              />
              {type === "rent" && <p className="formPriceText"> BGN / Month</p>}
            </div>
          </div>

          {offer && (
            <>
              <label htmlFor="formLabel">Discounted Price</label>

              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                min="100"
                max="10000000"
                value={discountedPrice}
                required={offer}
                onChange={onTransform}
              />
            </>
          )}

          <label htmlFor="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max: up to 6).
          </p>
          <input
            type="file"
            className="formInputFile"
            id="images"
            onChange={onTransform}
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button
            type="submit"
            className="formButton createListingButton btn-grad"
          >
            Create listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
