import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { db } from "../firebase.config";
import { getAuth } from "firebase/auth";

export default function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const auth = getAuth();
  const [lastVisibleAds, setLastVisibleAds] = useState();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
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
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Something went wrong");
      }
    };

    fetchListings();
  }, []);

  const onMore = async () => {
    try {
      const q = query(
        collection(db, "listings"),
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastVisibleAds),
        limit(10)
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
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((item) => (
                <ListingItem key={item.id} listing={item.data} id={item.id} />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>There are no current offers</p>
      )}
      {lastVisibleAds && (
        <p className="loadMore btn-grad" onClick={onMore}>
          Load More
        </p>
      )}
    </div>
  );
}
