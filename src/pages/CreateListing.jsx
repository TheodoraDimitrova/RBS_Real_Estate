import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function CreateListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, SetLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const [formData, SetFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: [],
    location: {
      lat: 0,
      long: 0,
    },
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user", user);
        SetFormData({ ...formData, useRef: user.uid });
      } else {
        navigate("/sign-in");
      }
    });

    return unsub; //cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
  }, []);

  if (loading) return <Spinner />;

  return <div></div>;
}

export default CreateListing;
