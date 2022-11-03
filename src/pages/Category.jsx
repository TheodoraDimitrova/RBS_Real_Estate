import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import AdvertisementsContext from "../context/AdvertisementsContext";

export default function Category() {
  const { loading, ads, fetchAdsByCategoryName, lastVisibleAds, onMore } =
    useContext(AdvertisementsContext);

  const params = useParams();

  useEffect(() => {
    console.log("in");
    fetchAdsByCategoryName(params.categoryName);
    // eslint-disable-next-line
  }, []);

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
      ) : ads && ads.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {ads.map((item) => (
                <ListingItem key={item.id} listing={item.data} id={item.id} />
              ))}
            </ul>
          </main>
          {lastVisibleAds && (
            <p
              className="loadMore btn-grad"
              onClick={() => onMore(params.categoryName)}
            >
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No Advertisements for {params.categoryName}</p>
      )}
    </div>
  );
}
