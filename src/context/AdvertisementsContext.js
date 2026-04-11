import { createContext, useState } from "react";
import React from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

const AdvertisementsContext = createContext();

export const AdvertisementsProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]);
  const [lastVisibleAds, setLastVisibleAds] = useState(null);

  const fetchListings = async () => {
    const listingRef = collection(db, "listings");
    const q = query(listingRef, orderBy("timestamp", "desc"), limit(3));
    const querySnap = await getDocs(q);

    let ads = [];

    querySnap.forEach((doc) => {
      return ads.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    setAds(ads);
    setLoading(false);
  };
  const fetchAdsByCategoryName = async (category) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "listings"),
        where("type", "==", category),
        orderBy("timestamp", "desc"),
        limit(10),
      );
      const querySnapshot = await getDocs(q);
      const lastVisible =
        querySnapshot.docs.length > 0
          ? querySnapshot.docs[querySnapshot.docs.length - 1]
          : null;
      setLastVisibleAds(lastVisible);

      const listings = [];
      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setAds(listings);
    } catch (error) {
      toast.error("Something went wrong");
      setAds([]);
      setLastVisibleAds(null);
    } finally {
      setLoading(false);
    }
  };
  const onMore = async (category) => {
    try {
      const q = query(
        collection(db, "listings"),
        where("type", "==", category),
        orderBy("timestamp", "desc"),
        startAfter(lastVisibleAds),
        limit(10),
      );
      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisibleAds(lastVisible);

      const listings = [];
      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setAds((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <AdvertisementsContext.Provider
        value={{
          loading,
          setLoading,
          ads,
          setAds,
          fetchListings,
          fetchAdsByCategoryName,
          lastVisibleAds,
          onMore,
        }}
      >
        {children}
      </AdvertisementsContext.Provider>
    </div>
  );
};

export default AdvertisementsContext;
