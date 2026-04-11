import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import { db } from "../firebase.config";
import { applyOffersClientFilters } from "../utils/offersClientFilters";

const OFFER_SORT = {
  newest: "newest",
  cheapest: "cheapest",
  discount: "discount",
};

const buildOffersPageQuery = (typeFilter, lastDoc) => {
  const constraints = [where("offer", "==", true)];
  if (typeFilter === "rent" || typeFilter === "sell") {
    constraints.push(where("type", "==", typeFilter));
  }
  constraints.push(orderBy("timestamp", "desc"));
  if (lastDoc) constraints.push(startAfter(lastDoc));
  constraints.push(limit(10));
  return query(collection(db, "listings"), ...constraints);
};

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [lastVisibleAds, setLastVisibleAds] = useState();
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [minDiscount, setMinDiscount] = useState("");
  const [sortBy, setSortBy] = useState(OFFER_SORT.newest);

  useEffect(() => {
    let cancelled = false;

    const fetchListings = async () => {
      setLoading(true);
      try {
        const q = buildOffersPageQuery(typeFilter, null);
        const querySnapshot = await getDocs(q);
        if (cancelled) return;
        setHasMore(querySnapshot.docs.length === 10);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisibleAds(lastVisible);
        const next = [];
        querySnapshot.forEach((docSnap) => {
          next.push({
            id: docSnap.id,
            data: docSnap.data(),
          });
        });
        setListings(next);
      } catch {
        if (!cancelled) {
          toast.error("Something went wrong");
          setListings([]);
          setHasMore(false);
          setLastVisibleAds(undefined);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchListings();
    return () => {
      cancelled = true;
    };
  }, [typeFilter]);

  const onMore = async () => {
    if (loadingMore || !lastVisibleAds) return;
    setLoadingMore(true);
    try {
      const q = buildOffersPageQuery(typeFilter, lastVisibleAds);
      const querySnapshot = await getDocs(q);
      setHasMore(querySnapshot.docs.length === 10);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisibleAds(lastVisible);

      const batch = [];
      querySnapshot.forEach((docSnap) => {
        batch.push({
          id: docSnap.id,
          data: docSnap.data(),
        });
      });
      setListings((prev) => [...(prev ?? []), ...batch]);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoadingMore(false);
    }
  };

  const clientFilterOpts = useMemo(
    () => ({
      priceMin,
      priceMax,
      minDiscount,
      sortBy,
    }),
    [priceMin, priceMax, minDiscount, sortBy],
  );

  const displayedListings = useMemo(() => {
    if (!listings?.length) return [];
    return applyOffersClientFilters(listings, clientFilterOpts);
  }, [listings, clientFilterOpts]);

  const loadedCount = listings?.length ?? 0;
  const displayedCount = displayedListings.length;
  const hasClientFilters =
    priceMin.trim() !== "" ||
    priceMax.trim() !== "" ||
    minDiscount.trim() !== "" ||
    sortBy !== OFFER_SORT.newest;

  const resetClientFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setMinDiscount("");
    setSortBy(OFFER_SORT.newest);
  };

  const showNoMatch =
    !loading && loadedCount > 0 && displayedCount === 0;

  return (
    <div className="offersPage">
      <header className="offersHero">
        <div className="offersHeroCard">
          <div className="offersHeroRow">
            <h1 className="offersTitle">Special offers</h1>
            {!loading && loadedCount > 0 && (
              <span
                className="offersCountPill"
                aria-label={
                  displayedCount === loadedCount
                    ? `${displayedCount} offers`
                    : `${displayedCount} offers matching filters of ${loadedCount} loaded`
                }
              >
                {displayedCount}
                {hasClientFilters && displayedCount !== loadedCount ? (
                  <span className="offersCountPillSub"> / {loadedCount}</span>
                ) : null}
              </span>
            )}
          </div>
          <p className="offersLead">
            Listings with a reduced price — open one for photos, description,
            and contact.
          </p>
          {!loading && loadedCount > 0 && hasMore && (
            <p className="offersHint">Use “Load more” for older offers.</p>
          )}
        </div>
      </header>

      <section
        className="offersFilters"
        aria-label="Filter and sort offers"
      >
        <div className="offersFiltersInner">
          <div className="offersFilterField">
            <span className="offersFilterLabel" id="offers-type-label">
              Listing type
            </span>
            <div
              className="offersTypeToggle"
              role="group"
              aria-labelledby="offers-type-label"
            >
              {[
                { id: "all", label: "All" },
                { id: "rent", label: "Rent" },
                { id: "sell", label: "Sale" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={
                    typeFilter === id
                      ? "offersTypeBtn offersTypeBtn--active"
                      : "offersTypeBtn"
                  }
                  onClick={() => setTypeFilter(id)}
                  disabled={loading}
                  aria-pressed={typeFilter === id}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="offersFilterRow offersFilterRow--prices">
            <div className="offersFilterField offersFilterField--grow">
              <label className="offersFilterLabel" htmlFor="offers-price-min">
                Min price (€)
              </label>
              <input
                id="offers-price-min"
                type="number"
                inputMode="decimal"
                min={0}
                className="offersFilterInput"
                placeholder="Any"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                aria-describedby="offers-client-filter-hint"
              />
            </div>
            <div className="offersFilterField offersFilterField--grow">
              <label className="offersFilterLabel" htmlFor="offers-price-max">
                Max price (€)
              </label>
              <input
                id="offers-price-max"
                type="number"
                inputMode="decimal"
                min={0}
                className="offersFilterInput"
                placeholder="Any"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                aria-describedby="offers-client-filter-hint"
              />
            </div>
            <div className="offersFilterField offersFilterField--grow">
              <label
                className="offersFilterLabel"
                htmlFor="offers-min-discount"
              >
                Min. discount (€)
              </label>
              <input
                id="offers-min-discount"
                type="number"
                inputMode="decimal"
                min={0}
                className="offersFilterInput"
                placeholder="e.g. 50"
                value={minDiscount}
                onChange={(e) => setMinDiscount(e.target.value)}
                aria-describedby="offers-client-filter-hint"
              />
            </div>
          </div>

          <div className="offersFilterField">
            <label className="offersFilterLabel" htmlFor="offers-sort">
              Sort (loaded offers)
            </label>
            <select
              id="offers-sort"
              className="offersFilterSelect"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-describedby="offers-client-filter-hint"
            >
              <option value={OFFER_SORT.newest}>Newest first</option>
              <option value={OFFER_SORT.cheapest}>Cheapest first</option>
              <option value={OFFER_SORT.discount}>Biggest savings (€)</option>
            </select>
          </div>

          {hasClientFilters && (
            <button
              type="button"
              className="offersFilterReset"
              onClick={resetClientFilters}
            >
              Reset filters
            </button>
          )}

          <p className="offersFilterHint" id="offers-client-filter-hint">
            Filters apply only to offers already loaded — use Load more for
            older ones. Listing type is set on the server. Min. discount (€) is
            the minimum price cut vs regular (regular minus discounted), e.g. 50
            means at least €50 off. Leave empty for no minimum.
          </p>
        </div>
      </section>

      {loading ? (
        <div
          className="offersSkeleton"
          aria-busy="true"
          aria-label="Loading offers"
        />
      ) : loadedCount === 0 ? (
        <div className="offersEmpty" role="status">
          <div className="offersEmptyCard">
            <p className="offersEmptyTitle">No special offers right now</p>
            <p className="offersEmptyText">
              When sellers add a discount, it will appear here. Meanwhile,
              browse all rent and sale listings.
            </p>
            <div className="offersEmptyActions">
              <Link to="/category/rent" className="offersEmptyCta btn-grad">
                Browse rent
              </Link>
              <Link to="/category/sell" className="offersEmptyCta btn-grad">
                Browse sale
              </Link>
            </div>
            <Link to="/" className="offersEmptyLink">
              Back to home
            </Link>
          </div>
        </div>
      ) : showNoMatch ? (
        <div className="offersEmpty offersEmpty--filters" role="status">
          <div className="offersEmptyCard">
            <p className="offersEmptyTitle">No offers match these filters</p>
            <p className="offersEmptyText">
              Try widening the price range, lowering the minimum discount, or
              loading more offers — filters only see listings already fetched.
            </p>
            <div className="offersEmptyActions">
                <button
                  type="button"
                  className="offersEmptyCta btn-grad"
                  onClick={resetClientFilters}
                >
                  Reset filters
                </button>
              {hasMore && (
                <button
                  type="button"
                  className="offersEmptyCta btn-grad"
                  onClick={onMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <main>
          <ul className="profileListingsGrid">
            {displayedListings.map((item) => (
              <ListingItem key={item.id} listing={item.data} id={item.id} />
            ))}
          </ul>
          {hasMore && (
            <button
              type="button"
              className="offersLoadMore btn-grad"
              onClick={onMore}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          )}
        </main>
      )}
    </div>
  );
};

export default Offers;
