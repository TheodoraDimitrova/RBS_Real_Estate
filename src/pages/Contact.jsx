import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase.config";

function Contact() {
  const [message, SetMessage] = useState("");
  const [owner, SetOwner] = useState(null);
  const [searchParams] = useSearchParams();
  const params = useParams();

  useEffect(() => {
    const getOwner = async () => {
      const docRef = doc(db, "users", params.adName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        SetOwner(docSnap.data());
      } else {
        toast.error("Could not get owner details");
      }
    };
    getOwner();
  }, [params.adName]);
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Contact owner on click");
  };
  const onType = (e) => SetMessage(e.target.value);

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Owner</p>
      </header>
      {owner !== null && (
        <main>
          <div className="contactlandLoard">
            <p className="landLoardName">Name for Contact {owner?.name}</p>
          </div>
          <form onSubmit={onSubmit}>
            <label htmlFor="message" className="messageLabel">
              Tape your message here
            </label>
            <textarea
              name="message"
              id="message"
              cols="10"
              rows="10"
              className="textarea"
              value={message}
              onChange={onType}
            />
            <a
              href={`mailto:${owner.email}?subject=${searchParams.get(
                "adName"
              )}&body=${message}`}
            >
              <button className="btn-grad" type="button">
                E-Mail to {owner.name}
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
