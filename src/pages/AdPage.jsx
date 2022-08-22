import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase.config";
import shareIcom from "../assets/svg/shareIcon.svg";
import { async } from "@firebase/util";

function AdPage() {
  const [ad, setAd] = useState(null);
  const [loading, SetLoading] = useState(true);
  const [shareLink, SetShareLink] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchAd = async () => {
      const docRef = doc(db, "listings", params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAd(docSnap.data());

        SetLoading(false);
      }
    };

    fetchAd();
  }, [navigate, params.id]);

  if (loading) return <Spinner />;

  return (
    <main>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          SetShareLink(true);

          setTimeout(() => {
            SetShareLink(false);
          }, 2000);
        }}
      >
        <img src={shareIcom} alt="share-icon" />
      </div>
      {shareLink && <p className="linkCopied">Link is copied!</p>}
      <div className="listingDetails">
        <p className="listingName">
          {ad.name} -{" "}
          {ad.offer
            ? ad.discoundPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : ad.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          ЛВ.
        </p>
        <p className="listingType btn-grad">
          {ad.type === "rent" ? "Rent" : "Sale"}
        </p>
        {ad.offer && (
          <p className="discountPrice">
            `${ad.regularPrice}- ${ad.discoundPrice}` discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>{ad.bedrooms > 1 ? `${ad.bedrooms} Bedrooms` : "1 Bedroom"}</li>
          <li>
            {ad.bathrooms > 1 ? `${ad.bathroom} Bathrooms` : "1 Bathroom"}
          </li>
          <li>{ad.parking && "Parking Spot"}</li>
          <li>{ad.furnished && "Furnished"}</li>
        </ul>
        {ad.useRef}-------
        {auth.currentUser.uid}
        {auth.currentUser.uid !== ad.useRef && (
          <Link
            className="btn-grad"
            to={`/contact/${ad.useRef}?adName=${ad.name}`}
          >
            Contact Owner
          </Link>
        )}
      </div>
    </main>
  );
}

export default AdPage;
