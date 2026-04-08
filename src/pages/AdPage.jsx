import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase.config";
import shareIcon from "../assets/svg/shareIcon.svg";

import { Navigation, Pagination, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/a11y";

function formatEur(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US");
}

function AdPage() {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [shareLink, setShareLink] = useState(false);
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    let cancelled = false;

    const fetchAd = async () => {
      setLoading(true);
      setMissing(false);
      const docRef = doc(db, "listings", params.id);
      const docSnap = await getDoc(docRef);

      if (cancelled) return;

      if (docSnap.exists()) {
        setAd(docSnap.data());
        setMissing(false);
      } else {
        setAd(null);
        setMissing(true);
      }
      setLoading(false);
    };

    fetchAd();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLink(true);
    setTimeout(() => setShareLink(false), 2000);
  };

  if (loading) return <Spinner />;

  if (missing || !ad) {
    return (
      <div className="adPage adPage--empty">
        <div className="adPageEmptyCard">
          <h1 className="adPageEmptyTitle">Listing not found</h1>
          <p className="adPageEmptyText">
            This property may have been removed or the link is incorrect.
          </p>
          <Link className="adPageEmptyCta btn-grad" to="/">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const imageUrls = Array.isArray(ad.imageUrls) ? ad.imageUrls : [];
  const categoryPath = `/category/${params.categoryName ?? ad.type ?? "rent"}`;
  const displayPrice = ad.offer ? ad.discountedPrice : ad.regularPrice;
  const regularNum = Number(ad.regularPrice);
  const discountedNum = Number(ad.discountedPrice);
  const savings =
    ad.offer && Number.isFinite(regularNum) && Number.isFinite(discountedNum)
      ? regularNum - discountedNum
      : null;
  const address =
    typeof ad.address === "string" && ad.address.trim() !== ""
      ? ad.address.trim()
      : null;
  const currentUid = auth.currentUser?.uid;
  const showContact = currentUid && currentUid !== ad.userRef;

  return (
    <div className="adPage">
      <header className="adPageHeader">
        <Link to={categoryPath} className="adPageBack">
          <span className="adPageBackIcon" aria-hidden="true">
            ←
          </span>
          {params.categoryName === "rent"
            ? "Rent listings"
            : params.categoryName === "sell"
              ? "Sale listings"
              : "All in category"}
        </Link>
        <button
          type="button"
          className="adPageShareBtn"
          onClick={copyShareLink}
          aria-label="Copy link to this listing"
        >
          <img src={shareIcon} alt="" width={20} height={20} />
          <span>Share</span>
        </button>
      </header>

      {shareLink && (
        <p className="adPageShareToast" role="status">
          Link copied to clipboard
        </p>
      )}

      <div className="adPageMain">
        <div className="adPageGalleryShell">
          {imageUrls.length > 0 ? (
            <Swiper
              className="adPageSwiper"
              navigation={true}
              modules={[Navigation, Pagination, A11y]}
              slidesPerView={1}
              a11y={{ enabled: true }}
              pagination={{ clickable: true }}
            >
              {imageUrls.map((url, index) => (
                <SwiperSlide key={`${url}-${index}`}>
                  <div className="adPageSlide">
                    <img
                      src={url}
                      alt={`${ad.name} — ${index + 1} of ${imageUrls.length}`}
                      className="adPageSlideImg"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="adPageNoPhotos" role="status">
              No pictures uploaded for this listing
            </div>
          )}
        </div>

        <article className="adPagePanel">
        <div className="adPageBadges">
          <span
            className={`adPageBadge adPageBadge--type adPageBadge--${ad.type === "rent" ? "rent" : "sell"}`}
          >
            {ad.type === "rent" ? "For rent" : "For sale"}
          </span>
          {ad.offer && (
            <span className="adPageBadge adPageBadge--offer">Special offer</span>
          )}
        </div>

        <h1 className="adPageTitle">{ad.name}</h1>

        <div className="adPagePriceBlock">
          <span className="adPagePriceMain">
            {formatEur(displayPrice)}
            <span className="adPagePriceCurrency"> EUR</span>
          </span>
          {ad.type === "rent" && (
            <span className="adPagePricePeriod">/ month</span>
          )}
        </div>

        {ad.offer && Number.isFinite(savings) && savings > 0 && (
          <div className="adPagePriceMeta">
            <span className="adPagePriceWas">
              Was {formatEur(ad.regularPrice)} EUR
            </span>
            <span className="adPagePriceSave">Save {formatEur(savings)} EUR</span>
          </div>
        )}

        {address && (
          <p className="adPageAddress">
            <span className="adPageAddressLabel">Location</span>
            {address}
          </p>
        )}

        <ul className="adPageSpecs" aria-label="Property details">
          <li className="adPageSpec">
            <span className="adPageSpecValue">{ad.bedrooms}</span>
            <span className="adPageSpecLabel">
              {ad.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
            </span>
          </li>
          <li className="adPageSpec">
            <span className="adPageSpecValue">{ad.bathrooms}</span>
            <span className="adPageSpecLabel">
              {ad.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
            </span>
          </li>
          {ad.parking && (
            <li className="adPageSpec adPageSpec--flag">
              <span className="adPageSpecLabel">Parking</span>
            </li>
          )}
          {ad.furnished && (
            <li className="adPageSpec adPageSpec--flag">
              <span className="adPageSpecLabel">Furnished</span>
            </li>
          )}
        </ul>

        {typeof ad.description === "string" && ad.description.trim() !== "" && (
          <section className="adPageDescription" aria-labelledby="ad-desc-heading">
            <h2 id="ad-desc-heading" className="adPageDescriptionTitle">
              About this property
            </h2>
            <p className="adPageDescriptionText">{ad.description.trim()}</p>
          </section>
        )}

        {showContact && (
          <>
            <Link
              className="adPageContact btn-grad"
              to={`/contact/${ad.userRef}?adName=${encodeURIComponent(ad.name)}`}
            >
              Contact owner
            </Link>
            <p className="adPageContactHint">
              On the next screen you&apos;ll see the owner&apos;s email and
              phone (if they added one in their profile).
            </p>
          </>
        )}
        </article>
      </div>
    </div>
  );
}

export default AdPage;
