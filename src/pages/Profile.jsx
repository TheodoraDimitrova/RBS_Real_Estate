import React, { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { db } from "../firebase.config";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import arrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import Modal from "../components/shared/Modal";
import { deleteObject, getStorage, ref } from "firebase/storage";

function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [ads, SetAds] = useState([]);
  const [changeDetails, setChangeDetails] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    id: null,
  });

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    phone: "",
  });
  const { name, email, phone } = formData;

  useEffect(() => {
    const fetchUserListings = async () => {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const u = userSnap.data();
        setFormData((prev) => ({
          ...prev,
          name: u.name ?? auth.currentUser.displayName ?? prev.name,
          phone: typeof u.phone === "string" ? u.phone : "",
        }));
      }

      const listingsRef = collection(db, "listings");

      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      SetAds(listings);
      setLoading(false);
    };
    fetchUserListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per uid; displayName read inside callback
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate("/");
    toast.success("User signed out!");
  };
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          name,
          email: auth.currentUser.email,
          phone: phone.trim(),
        },
        { merge: true }
      );
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Could not update profile details");
    }
  };

  const handleDeleteFalse = () => {
    setPopup({
      show: false,
      id: null,
    });
  };
  const onDelete = (id) => {
    setPopup({
      show: true,
      id,
    });
  };
  const handleDeleteTrue = async () => {
    handleDeleteFalse();
    setLoading({ show: true });
    //delete images in firebase
    const deleteImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const desertRef = ref(storage, `${image}`);
        try {
          deleteObject(desertRef);
          setLoading(false);
        } catch (error) {
          toast.error("Uh-oh, an error occurred!");
          setLoading(false);
        }
      });
    };
    const docRef = doc(db, "listings", popup.id);
    const docSnap = await getDoc(docRef);
    const images = docSnap.data().imageUrls;

    images.map(async (image) => {
      await deleteImage(image);
    });
    await deleteDoc(doc(db, "listings", popup.id));
    const updatedListings = ads.filter((ad) => ad.id !== popup.id);
    SetAds(updatedListings);
    setLoading(false);
    toast.success("Successfully deleted advertisement");
  };

  const onEdit = (adId) => {
    navigate(`/edit-ad/${adId}`);
  };

  if (loading) return <Spinner />;

  return (
    <>
      <Modal
        handleDeleteFalse={handleDeleteFalse}
        handleDeleteTrue={handleDeleteTrue}
        popup={popup}
      />
      <div className="profile">
        <header className="profileHeader">
          <p className="pageHeader">My Profile</p>
          <button className="logOut btn-grad" type="button" onClick={onLogout}>
            Logout
          </button>
        </header>
        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Personal Details</p>
            <p
              className="changePersonalDetails btn-grad"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
            >
              {changeDetails ? "Done" : "Change"}
            </p>
          </div>
          <div className="profileCart">
            <form>
              <input
                type="text"
                id="name"
                className={!changeDetails ? "profileName" : "profileNameActive"}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />
              <input
                type="text"
                id="email"
                className="profileEmail"
                disabled="disabled"
                value={email}
                onChange={onChange}
              />
              <p className="profileFieldHint">
                Phone is shown to people who use &quot;Contact owner&quot; on
                your listings.
              </p>
              <input
                type="tel"
                id="phone"
                className={
                  !changeDetails ? "profilePhone" : "profilePhoneActive"
                }
                disabled={!changeDetails}
                value={phone}
                onChange={onChange}
                autoComplete="tel"
                placeholder="e.g. +359 88 000 0000"
              />
            </form>
          </div>
          <Link to="/create-ad" className="createListing">
            <img src={homeIcon} alt="home" />
            <p>Sell or Rent your home</p>
            <img src={arrowRightIcon} alt="arrowRight" />
          </Link>

          {!loading && ads?.length > 0 && (
            <>
              <p className="listingsText">Your Advertismets</p>
              <ul className="listingsList">
                {ads.map((listing) => (
                  <ListingItem
                    listing={listing.data}
                    id={listing.id}
                    key={listing.id}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Profile;
