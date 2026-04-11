import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import { formatEurAmount } from "../utils/formatEurAmount";

const ListingItem = ({ listing, id, onDelete, onEdit, listingLinkState }) => {
  const basePath = `/category/${listing.type}/${id}`;
  const to =
    listingLinkState?.from === "profile"
      ? `${basePath}?from=profile`
      : basePath;
  const addressLine = (listing.address || listing.location || "").trim();
  const displayPrice = listing.offer ? listing.discountedPrice : listing.regularPrice;
  const listingTypeBadgeClass = `adPageBadge adPageBadge--${
    listing.type === "rent" ? "rent" : "sell"
  } adPageBadge--overImage`;
  const showToolbar = Boolean(onEdit || onDelete);

  return (
    <li className="profileListingCard">
      <div className="profileListingCardInner">
        <div className="profileListingCardMedia">
          <Link
            to={to}
            state={listingLinkState}
            className="profileListingCardImageLink"
          >
            <img
              src={listing.imageUrls?.[0]}
              alt={listing.name}
              className="profileListingCardImg"
            />
            <span className={listingTypeBadgeClass}>
              {listing.type === "rent" ? "For rent" : "For sale"}
            </span>
          </Link>
          {showToolbar && (
            <div className="profileListingCardToolbar">
              {onEdit && (
                <button
                  type="button"
                  className="profileListingIconBtn"
                  aria-label="Edit listing"
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit();
                  }}
                >
                  <EditIcon className="profileListingSvgIcon" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  className="profileListingIconBtn profileListingIconBtn--danger"
                  aria-label="Delete listing"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete();
                  }}
                >
                  <DeleteIcon className="profileListingSvgIcon" />
                </button>
              )}
            </div>
          )}
        </div>
        <Link to={to} state={listingLinkState} className="profileListingCardBodyLink">
          <div className="profileListingCardBody">
            <p className="profileListingCardPrice">
              {formatEurAmount(displayPrice)} €
              {listing.type === "rent" && (
                <span className="profileListingCardPeriod">/mo</span>
              )}
            </p>
            {listing.offer && (
              <p className="profileListingCardOfferLine">
                <span className="profileListingCardWas">
                  {formatEurAmount(listing.regularPrice)} €
                </span>
                <span className="profileListingOfferPill">Offer</span>
              </p>
            )}
            <h3 className="profileListingCardTitle">{listing.name}</h3>
            {addressLine ? (
              <p className="profileListingCardAddress">{addressLine}</p>
            ) : null}
            <div className="profileListingCardSpecs">
              {listing.bedrooms} beds · {listing.bathrooms} baths
            </div>
          </div>
        </Link>
      </div>
    </li>
  );
};

export default ListingItem;
