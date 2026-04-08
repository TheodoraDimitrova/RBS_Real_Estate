import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";

export default function ListingItem({ listing, id, onDelete, onEdit }) {
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="categoryListingLink"
      >
        <div className="categoryListingImgWrap">
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className="categoryListingImg"
          />
          <span className="categoryTag">
            {listing.type === "rent" ? "Rent" : "Sale"}
          </span>
        </div>
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{listing.location}</p>
          <p className="categoryListingName">{listing.name}</p>
          <p className="categoryListingPrice">
            {listing.offer ? (
              <>
                <span className="oldPrice">
                  {listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  EUR
                </span>
                <span className="newPrice">
                  {listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  EUR
                </span>
                <span className="offerBadge">Offer</span>
              </>
            ) : (
              <>
                {listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                EUR
              </>
            )}
            {listing.type === "rent" && <span className="pricePeriod">/Month</span>}
          </p>
          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="icon" />
            <p className="categoryListingInfoText">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : `${listing.bedrooms} Bedroom`}
            </p>
            <img src={bathtubIcon} alt="icon" />
            <p className="categoryListingInfoText">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : `${listing.bathrooms} Bathroom`}
            </p>
          </div>
        </div>
      </Link>
      {onEdit && (
        <EditIcon
          className="editIcon"
          fill="green"
          onClick={() => onEdit(listing.id)}
        />
      )}
      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231, 76, 60)"
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
    </li>
  );
}
