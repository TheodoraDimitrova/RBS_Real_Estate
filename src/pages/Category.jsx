import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import AdvertisementsContext from "../context/AdvertisementsContext";

const Category = () => {
  const { loading, ads, fetchAdsByCategoryName, lastVisibleAds, onMore } =
    useContext(AdvertisementsContext);

  const params = useParams();
  const categoryName = params.categoryName;
  const isRent = categoryName === "rent";

  useEffect(() => {
    if (categoryName) {
      fetchAdsByCategoryName(categoryName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- context fetch when route param changes
  }, [categoryName]);

  const title = isRent ? "Places for rent" : "Places for sale";
  const lead = isRent
    ? "Browse rental homes and apartments — open a listing for full details."
    : "Browse properties listed for purchase — open a listing for full details.";

  const count = ads?.length ?? 0;

  return (
    <div className="categoryPage">
      <header className="offersHero">
        <div className="offersHeroCard">
          <div className="offersHeroRow">
            <h1 className="offersTitle">{title}</h1>
            {!loading && count > 0 && (
              <span className="offersCountPill" aria-label={`${count} listings`}>
                {count}
              </span>
            )}
          </div>
          <p className="offersLead">{lead}</p>
          {!loading && count > 0 && lastVisibleAds && (
            <p className="offersHint">Use “Load more” for older listings.</p>
          )}
        </div>
      </header>

      {loading ? (
        <div
          className="categorySkeleton"
          aria-busy="true"
          aria-label="Loading listings"
        />
      ) : count > 0 ? (
        <main>
          <ul className="profileListingsGrid">
            {ads.map((item) => (
              <ListingItem key={item.id} listing={item.data} id={item.id} />
            ))}
          </ul>
          {lastVisibleAds && (
            <button
              type="button"
              className="categoryLoadMore btn-grad"
              onClick={() => onMore(categoryName)}
            >
              Load more
            </button>
          )}
        </main>
      ) : (
        <div className="categoryEmpty" role="status">
          <div className="categoryEmptyCard">
            <p className="categoryEmptyTitle">No listings in this category yet</p>
            <p className="categoryEmptyText">
              Try the other category or go back to the home page — new
              properties are added regularly.
            </p>
            <div className="categoryEmptyActions">
              <Link
                to={isRent ? "/category/sell" : "/category/rent"}
                className="categoryEmptyCta btn-grad"
              >
                {isRent ? "Browse for sale" : "Browse for rent"}
              </Link>
              <Link to="/" className="categoryEmptyLink">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
