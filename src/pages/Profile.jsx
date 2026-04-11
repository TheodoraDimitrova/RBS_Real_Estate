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
import { MdEdit, MdEmail, MdLocationOn, MdLogout } from "react-icons/md";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import Modal from "../components/shared/Modal";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { memberYearFromUserData } from "../utils/memberYearFromUserData";

const Profile = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [ads, SetAds] = useState([]);
  const [changeDetails, setChangeDetails] = useState(false);
  const [memberSinceYear, setMemberSinceYear] = useState(null);
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

  const previewLocation =
    ads[0]?.data?.address && typeof ads[0].data.address === "string"
      ? ads[0].data.address.trim()
      : null;

  const initials =
    (name || "?")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  useEffect(() => {
    const fetchUserListings = async () => {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const u = userSnap.data();
        setMemberSinceYear(memberYearFromUserData(u));
        setFormData((prev) => ({
          ...prev,
          name: u.name ?? auth.currentUser.displayName ?? prev.name,
          phone: typeof u.phone === "string" ? u.phone : "",
        }));
      } else {
        setMemberSinceYear(new Date().getFullYear());
      }

      const listingsRef = collection(db, "listings");

      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);

      const listings = [];

      querySnap.forEach((docSnap) => {
        return listings.push({
          id: docSnap.id,
          data: docSnap.data(),
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
    setLoading(true);
    const deleteImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const desertRef = ref(storage, `${image}`);
        try {
          deleteObject(desertRef);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    };
    const docRef = doc(db, "listings", popup.id);
    const docSnap = await getDoc(docRef);
    const images = docSnap.data().imageUrls;

    await Promise.all((images || []).map((image) => deleteImage(image)));
    await deleteDoc(doc(db, "listings", popup.id));
    const updatedListings = ads.filter((ad) => ad.id !== popup.id);
    SetAds(updatedListings);
    setLoading(false);
    toast.success("Successfully deleted advertisement");
  };

  const onEdit = (adId) => {
    navigate(`/edit-ad/${adId}`);
  };

  const toggleEditProfile = () => {
    if (changeDetails) {
      onSubmit();
    }
    setChangeDetails((prev) => !prev);
  };

  if (loading) return <Spinner />;

  return (
    <>
      <Modal
        handleDeleteFalse={handleDeleteFalse}
        handleDeleteTrue={handleDeleteTrue}
        popup={popup}
      />
      <div className="profile profilePage">
        <div className="profileLayout">
          <aside className="profileSidebar" aria-label="Your profile">
            <div className="profileSidebarCard">
              <div className="profileAvatar" aria-hidden="true">
                {initials}
              </div>
              <h2 className="profileSidebarName">{name || "User"}</h2>
              <p className="profileSidebarMeta">
                Member since {memberSinceYear ?? "—"}
              </p>

              <div className="profileSidebarRows">
                <div className="profileSidebarRow">
                  <MdEmail className="profileSidebarIcon" aria-hidden />
                  <span className="profileSidebarRowText">{email}</span>
                </div>
                {previewLocation ? (
                  <div className="profileSidebarRow">
                    <MdLocationOn className="profileSidebarIcon" aria-hidden />
                    <span className="profileSidebarRowText">
                      {previewLocation}
                    </span>
                  </div>
                ) : (
                  <div className="profileSidebarRow profileSidebarRow--muted">
                    <MdLocationOn className="profileSidebarIcon" aria-hidden />
                    <span className="profileSidebarRowText">
                      Address from your listings
                    </span>
                  </div>
                )}
              </div>

              {changeDetails && (
                <form
                  className="profileSidebarForm"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="name" className="profileSidebarLabel">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="profileSidebarInput"
                    value={name}
                    onChange={onChange}
                  />
                  <label htmlFor="email" className="profileSidebarLabel">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="profileSidebarInput profileSidebarInput--disabled"
                    disabled
                    value={email}
                    readOnly
                  />
                  <p className="profileSidebarHint">
                    Phone is shown when someone uses Contact owner on your
                    listings.
                  </p>
                  <label htmlFor="phone" className="profileSidebarLabel">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="profileSidebarInput"
                    value={phone}
                    onChange={onChange}
                    autoComplete="tel"
                    placeholder="+359 …"
                  />
                </form>
              )}

              <button
                type="button"
                className="profileSidebarEditBtn"
                onClick={toggleEditProfile}
              >
                <MdEdit className="profileSidebarEditIcon" aria-hidden />
                {changeDetails ? "Save profile" : "Edit profile"}
              </button>

              <button
                type="button"
                className="profileSidebarSignOut"
                onClick={onLogout}
              >
                <MdLogout className="profileSidebarSignOutIcon" aria-hidden />
                Sign out
              </button>
            </div>
          </aside>

          <main className="profileMain">
            <div className="profileMainHeader">
              <h1 className="profileMainTitle">My listings</h1>
              <Link to="/create-ad" className="profileNewListingBtn">
                + New listing
              </Link>
            </div>

            {ads?.length > 0 ? (
              <ul className="profileListingsGrid">
                {ads.map((listing) => (
                  <ListingItem
                    listing={listing.data}
                    id={listing.id}
                    key={listing.id}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                    listingLinkState={{ from: "profile" }}
                  />
                ))}
              </ul>
            ) : (
              <div className="profileEmptyListings">
                <p className="profileEmptyTitle">No listings yet</p>
                <p className="profileEmptyText">
                  Create your first listing to appear here.
                </p>
                <Link to="/create-ad" className="profileEmptyCta btn-grad">
                  + New listing
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Profile;
