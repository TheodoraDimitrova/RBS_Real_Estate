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

export default function Category() {
  const [listings, SetListings] = useState(null);
  const [loading, SetLoading] = useState(true);
  const params = useParams();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const listings = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //   console.log(doc.id, " => ", doc.data());
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        SetListings(listings);
        SetLoading(false);
      } catch (error) {
        toast.error("Something went wrong");
      }
    };

    fetchListings();
  }, [params.categoryName]);

  const onDelete = (id, name) => {
    console.log("delete", id, name);
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for Rent"
            : "Places for Sale"}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((item) => (
                <ListingItem
                  key={item.id}
                  listing={item.data}
                  id={item.id}
                  // onDelete={
                  //   item.data.userRef === user.uid ? onDelete : undefined
                  // }
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No Advertisements for {params.categoryName}</p>
      )}
    </div>
  );
}
