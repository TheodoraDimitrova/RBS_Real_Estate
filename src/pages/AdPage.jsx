import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { MdArrowBack, MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import Spinner from "../components/Spinner";
import { db } from "../firebase.config";
import shareIcon from "../assets/svg/shareIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import { phoneToTelHref } from "../utils/contact";
import { formatEurAmount } from "../utils/formatEurAmount";
import { initialsFromName } from "../utils/initialsFromName";
import { memberYearFromUserData } from "../utils/memberYearFromUserData";
import { Navigation, Pagination, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/a11y";

const AdPage = () => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [shareLink, setShareLink] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [owner, setOwner] = useState(null);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const params = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
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

  const currentUid = auth.currentUser?.uid;
  const isOwner = Boolean(
    currentUid && ad?.userRef && currentUid === ad.userRef,
  );
  const showContact = Boolean(
    currentUid && ad?.userRef && currentUid !== ad.userRef,
  );

  useEffect(() => {
    if (!ad?.userRef || !showContact) {
      setOwner(null);
      setOwnerLoading(false);
      return;
    }
    let cancelled = false;
    setOwnerLoading(true);
    getDoc(doc(db, "users", ad.userRef))
      .then((snap) => {
        if (cancelled) return;
        setOwner(snap.exists() ? snap.data() : null);
        setOwnerLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setOwner(null);
        setOwnerLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ad?.userRef, showContact]);

  useEffect(() => {
    setActiveImageIndex(0);
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
  const fromProfile =
    location.state?.from === "profile" ||
    searchParams.get("from") === "profile";
  const adBackPath = fromProfile ? "/profile" : categoryPath;
  const adBackLabel = fromProfile
    ? "Back to profile"
    : "Back to category listings";
  const adBackAria = fromProfile
    ? "Back to your profile"
    : "Back to category listings";
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

  const phoneRaw =
    owner && typeof owner.phone === "string" ? owner.phone.trim() : "";
  const telHref = phoneRaw ? phoneToTelHref(phoneRaw) : "";

  const contactUrl = `/contact/${ad.userRef}?adName=${encodeURIComponent(ad.name)}`;

  const features = [];
  if (ad.parking) features.push("Parking");
  if (ad.furnished) features.push("Furnished");
  if (ad.offer) features.push("Special offer");

  const sizeSqm =
    ad.sizeSqm != null && ad.sizeSqm !== "" ? Number(ad.sizeSqm) : null;
  const showSize = Number.isFinite(sizeSqm) && sizeSqm > 0;

  const memberYear = owner ? memberYearFromUserData(owner) : null;

  const thumbIndices = imageUrls
    .map((_, i) => i)
    .filter((i) => i !== activeImageIndex);
  const mainSrc = imageUrls[activeImageIndex] ?? imageUrls[0];
  /* Desktop strip: 2 columns × up to 4 rows (max 8 thumb slots); hero stays left */
  const thumbGridCols = thumbIndices.length <= 1 ? 1 : 2;
  const thumbGridRows =
    thumbGridCols === 1
      ? Math.max(1, thumbIndices.length)
      : Math.min(4, Math.ceil(thumbIndices.length / 2));

  return (
    <div className="adPage">
      <header className="adPageHeader">
        <Link
          to={adBackPath}
          className="adPageBack"
          aria-label={adBackAria}
        >
          <span className="adPageBackIcon" aria-hidden="true">
            <MdArrowBack className="adPageBackArrow" />
          </span>
          <span className="adPageBackText">{adBackLabel}</span>
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

      <section className="adPageGallerySection" aria-label="Photos">
        {imageUrls.length > 0 ? (
          <>
            <div className="adPageGalleryDesktop">
              <div
                className={`adPageGalleryGrid ${
                  thumbIndices.length > 0 ? "adPageGalleryGrid--split" : ""
                }`}
              >
                <div className="adPageGalleryHero">
                  <img
                    src={mainSrc}
                    alt={`${ad.name} — ${activeImageIndex + 1} / ${imageUrls.length}`}
                    className="adPageGalleryHeroImg"
                  />
                </div>
                {thumbIndices.length > 0 && (
                  <div
                    className="adPageGalleryThumbs"
                    style={{
                      gridTemplateColumns: `repeat(${thumbGridCols}, minmax(0, 1fr))`,
                      gridTemplateRows: `repeat(${thumbGridRows}, minmax(0, 1fr))`,
                    }}
                  >
                    {thumbIndices.map((imgIndex) => (
                      <button
                        key={imgIndex}
                        type="button"
                        className="adPageGalleryThumb"
                        onClick={() => setActiveImageIndex(imgIndex)}
                        aria-label={`Show photo ${imgIndex + 1}`}
                      >
                        <img
                          src={imageUrls[imgIndex]}
                          alt=""
                          className="adPageGalleryThumbImg"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="adPageGalleryMobile">
              <div className="adPageGalleryShell">
                <Swiper
                  className="adPageSwiper"
                  navigation={true}
                  modules={[Navigation, Pagination, A11y]}
                  slidesPerView={1}
                  a11y={{ enabled: true }}
                  pagination={{ clickable: true }}
                  onSlideChange={(swiper) =>
                    setActiveImageIndex(swiper.activeIndex)
                  }
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
              </div>
            </div>
          </>
        ) : (
          <div className="adPageGalleryShell adPageGalleryShell--empty">
            <div className="adPageNoPhotos" role="status">
              No pictures uploaded for this listing
            </div>
          </div>
        )}
      </section>

      <div className="adPageDetailLayout">
        <div className="adPagePrimary">
          <div className="adPageBadges">
            <span
              className={`adPageBadge adPageBadge--${ad.type === "rent" ? "rent" : "sell"}`}
            >
              {ad.type === "rent" ? "For rent" : "For sale"}
            </span>
            {ad.offer && (
              <span className="adPageBadge adPageBadge--offer">
                Special offer
              </span>
            )}
          </div>

          <h1 className="adPageTitle">{ad.name}</h1>

          {address && (
            <p className="adPageLocation">
              <MdLocationOn className="adPageLocationIcon" aria-hidden />
              {address}
            </p>
          )}

          <div className="adPagePriceBlock">
            <span className="adPagePriceMain">{formatEurAmount(displayPrice)} €</span>
            {ad.type === "rent" && (
              <span className="adPagePricePeriod">/mo</span>
            )}
          </div>

          {ad.offer && Number.isFinite(savings) && savings > 0 && (
            <div className="adPagePriceMeta">
              <span className="adPagePriceWas">
                Was {formatEurAmount(ad.regularPrice)} €
              </span>
              <span className="adPagePriceSave">
                Save {formatEurAmount(savings)} €
              </span>
            </div>
          )}

          <ul className="adPageSpecsRow" aria-label="Property details">
            <li className="adPageSpecInline">
              <img src={bedIcon} alt="" className="adPageSpecInlineIcon" />
              <span>
                {ad.bedrooms} {ad.bedrooms === 1 ? "Bed" : "Beds"}
              </span>
            </li>
            <li className="adPageSpecInline">
              <img src={bathtubIcon} alt="" className="adPageSpecInlineIcon" />
              <span>
                {ad.bathrooms} {ad.bathrooms === 1 ? "Bath" : "Baths"}
              </span>
            </li>
            {showSize && (
              <li className="adPageSpecInline">
                <span className="adPageSpecInlineM2" aria-hidden>
                  m²
                </span>
                <span>{sizeSqm} m²</span>
              </li>
            )}
          </ul>

          {typeof ad.description === "string" &&
            ad.description.trim() !== "" && (
              <section
                className="adPageDescription"
                aria-labelledby="ad-desc-heading"
              >
                <h2 id="ad-desc-heading" className="adPageSectionHeading">
                  Description
                </h2>
                <p className="adPageDescriptionText">{ad.description.trim()}</p>
              </section>
            )}

          {features.length > 0 && (
            <section
              className="adPageFeatures"
              aria-labelledby="ad-features-heading"
            >
              <h2 id="ad-features-heading" className="adPageSectionHeading">
                Features
              </h2>
              <ul className="adPageFeatureTags">
                {features.map((label) => (
                  <li
                    key={label}
                    className={
                      label === "Special offer"
                        ? "adPageFeatureTag adPageFeatureTag--accent"
                        : "adPageFeatureTag adPageFeatureTag--brand"
                    }
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="adPageSidebar">
          {isOwner ? (
            <div className="adPageContactCard">
              <h2 className="adPageContactCardTitle">Your listing</h2>
              <p className="adPageContactCardLead">
                This property is published under your account.
              </p>
              <Link
                to={`/edit-ad/${params.id}`}
                className="adPageContactPrimary btn-grad"
              >
                Edit listing
              </Link>
            </div>
          ) : !currentUid ? (
            <div className="adPageContactCard">
              <h2 className="adPageContactCardTitle">Contact owner</h2>
              <p className="adPageContactCardLead">
                Sign in to message the owner or see their phone number.
              </p>
              <Link to="/sign-in" className="adPageContactPrimary btn-grad">
                Sign in
              </Link>
            </div>
          ) : showContact ? (
            <div className="adPageContactCard">
              <h2 className="adPageContactCardTitle">Contact owner</h2>
              {ownerLoading ? (
                <p className="adPageContactCardLead">Loading…</p>
              ) : owner ? (
                <>
                  <div className="adPageOwner">
                    <div className="adPageOwnerAvatar" aria-hidden>
                      {initialsFromName(owner.name)}
                    </div>
                    <div className="adPageOwnerText">
                      <p className="adPageOwnerName">{owner.name || "Owner"}</p>
                      {memberYear && (
                        <p className="adPageOwnerMeta">
                          Member since {memberYear}
                        </p>
                      )}
                    </div>
                  </div>
                  <Link
                    to={contactUrl}
                    className="adPageContactPrimary adPageContactPrimary--icon btn-grad"
                  >
                    <MdEmail className="adPageContactBtnIcon" aria-hidden />
                    Send message
                  </Link>
                  {phoneRaw && telHref ? (
                    <a
                      href={`tel:${telHref}`}
                      className="adPageContactSecondary adPageContactSecondary--icon"
                    >
                      <MdPhone className="adPageContactBtnIcon" aria-hidden />
                      Call {phoneRaw}
                    </a>
                  ) : (
                    <p className="adPageContactMuted">
                      Phone not shared by the owner. You can still reach them by
                      message.
                    </p>
                  )}
                </>
              ) : (
                <p className="adPageContactCardLead">
                  Owner profile unavailable.
                </p>
              )}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
};

export default AdPage;
