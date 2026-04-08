import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import { phoneToTelHref } from "../utils/contact";

function Contact() {
  const [message, setMessage] = useState("");
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const params = useParams();
  const landlordId = params.adName;
  const adTitle = searchParams.get("adName") || "Listing";

  useEffect(() => {
    let cancelled = false;

    const getOwner = async () => {
      setLoading(true);
      const docRef = doc(db, "users", landlordId);
      const docSnap = await getDoc(docRef);

      if (cancelled) return;

      if (docSnap.exists()) {
        setOwner(docSnap.data());
      } else {
        setOwner(null);
        toast.error("Could not load owner details");
      }
      setLoading(false);
    };

    getOwner();
    return () => {
      cancelled = true;
    };
  }, [landlordId]);

  const onType = (e) => setMessage(e.target.value);

  const phoneRaw =
    owner && typeof owner.phone === "string" ? owner.phone.trim() : "";
  const telHref = phoneRaw ? phoneToTelHref(phoneRaw) : "";

  const mailHref = owner?.email
    ? `mailto:${encodeURIComponent(owner.email)}?subject=${encodeURIComponent(
        `About: ${adTitle}`
      )}&body=${encodeURIComponent(message)}`
    : null;

  return (
    <div className="contactPage">
      <header>
        <p className="pageHeader">Contact owner</p>
        <p className="contactMuted">Regarding: {adTitle}</p>
      </header>

      {loading ? (
        <Spinner />
      ) : owner ? (
        <main>
          <div className="contactOwnerCard">
            <p className="contactOwnerCardTitle">Owner</p>
            <p className="contactOwnerName">{owner.name || "—"}</p>
            {owner.email && (
              <p className="contactOwnerRow">
                Email:{" "}
                <a href={`mailto:${owner.email}`}>{owner.email}</a>
              </p>
            )}
            {phoneRaw ? (
              <p className="contactOwnerRow">
                Phone:{" "}
                {telHref ? (
                  <a href={`tel:${telHref}`}>{phoneRaw}</a>
                ) : (
                  <span>{phoneRaw}</span>
                )}
              </p>
            ) : (
              <p className="contactMuted">
                This owner has not added a phone number yet. You can still
                reach them by email.
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label htmlFor="message" className="messageLabel">
              Your message (optional — included in the email draft)
            </label>
            <textarea
              name="message"
              id="message"
              cols="10"
              rows="8"
              className="textarea"
              value={message}
              onChange={onType}
            />
            <div className="contactActions">
              {mailHref && (
                <a href={mailHref} className="btn-grad">
                  Open email to {owner.name || "owner"}
                </a>
              )}
              {phoneRaw && telHref && (
                <a href={`tel:${telHref}`} className="btn-grad">
                  Call {phoneRaw}
                </a>
              )}
            </div>
          </form>
        </main>
      ) : null}
    </div>
  );
}

export default Contact;
