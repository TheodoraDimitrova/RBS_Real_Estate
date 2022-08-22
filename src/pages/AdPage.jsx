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
        console.log(docSnap.data());
        setAd(docSnap.data());
        SetLoading(false);
      }
    };

    fetchAd();
  }, [navigate, params.id]);

  return <div>AdPage</div>;
}

export default AdPage;
