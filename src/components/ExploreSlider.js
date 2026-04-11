import { Link, useNavigate } from "react-router-dom";
import { Navigation, Pagination, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/a11y";
import { useContext, useEffect } from "react";
import AdvertisementsContext from "../context/AdvertisementsContext";
import { formatListingEurAmount } from "../utils/formatEurAmount";

const ExploreSlider = () => {
  const { loading, ads, fetchListings } = useContext(AdvertisementsContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  if (loading) {
    return (
      <section className="exploreSection exploreFeatured">
        <div className="exploreSectionHead">
          <h2 className="exploreSectionTitle">
            Featured listings
          </h2>
          <p className="exploreSectionSub">
            Hand-picked from the latest on the platform
          </p>
        </div>
        <div className="exploreFeaturedSkeleton" />
      </section>
    );
  }

  if (!ads?.length) {
    return (
      <section className="exploreSection exploreFeatured">
        <div className="exploreSectionHead">
          <h2 className="exploreSectionTitle">
            Featured listings
          </h2>
          <p className="exploreSectionSub">
            Hand-picked from the latest on the platform
          </p>
        </div>
        <div className="exploreFeaturedEmpty" role="status">
          <p className="exploreFeaturedEmptyText">
            No public listings yet. Explore by category below — new homes are
            added regularly.
          </p>
          <div className="exploreFeaturedEmptyActions">
            <button
              type="button"
              className="exploreFeaturedEmptyBtn"
              onClick={() => navigate("/category/rent")}
            >
              Browse rent
            </button>
            <button
              type="button"
              className="exploreFeaturedEmptyBtn exploreFeaturedEmptyBtn--ghost"
              onClick={() => navigate("/category/sell")}
            >
              Browse sale
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="exploreSection exploreFeatured">
      <div className="exploreSectionHead">
        <h2 className="exploreSectionTitle">
          Featured listings
        </h2>
        <p className="exploreSectionSub">
          Swipe or use arrows — tap a card for the full listing
        </p>
      </div>

      <div className="exploreSwiperShell">
        <Swiper
          className="exploreSwiper"
          modules={[Navigation, Pagination, A11y]}
          slidesPerView={1}
          spaceBetween={12}
          pagination={{ clickable: true }}
          navigation
          a11y={{ enabled: true }}
        >
          {ads.map(({ data, id }) => {
            const path = `/category/${data.type}/${id}`;
            const displayPrice = formatListingEurAmount(data);
            const img = data.imageUrls?.[0];
            const typeClass =
              data.type === "rent" ? "adPageBadge--rent" : "adPageBadge--sell";
            const typeLabel = data.type === "rent" ? "For rent" : "For sale";

            return (
              <SwiperSlide key={id}>
                <Link
                  to={path}
                  className="exploreSlide"
                  aria-label={`${data.name}, ${displayPrice} EUR${
                    data.type === "rent" ? " per month" : ""
                  }. Open listing.`}
                >
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      className="exploreSlideImg"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div
                      className="exploreSlideImg exploreSlideImg--placeholder"
                      aria-hidden
                    />
                  )}
                  <div className="exploreSlideScrim" aria-hidden />
                  <div className="exploreSlideBody">
                    <span
                      className={`adPageBadge exploreSlideBadge ${typeClass}`}
                    >
                      {typeLabel}
                    </span>
                    <p className="exploreSlideTitle">{data.name}</p>
                    <p className="exploreSlidePriceRow">
                      <span className="exploreSlidePrice">{displayPrice}</span>
                      <span className="exploreSlideCurrency"> EUR</span>
                      {data.type === "rent" && (
                        <span className="exploreSlidePeriod">/ month</span>
                      )}
                    </p>
                    <span className="exploreSlideHint">View details</span>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default ExploreSlider;
