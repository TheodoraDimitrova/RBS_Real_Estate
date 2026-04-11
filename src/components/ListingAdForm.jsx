import { AiTwotoneDelete } from "react-icons/ai";
import {
  MAX_LISTING_IMAGES,
  MIN_LISTING_DESCRIPTION,
  MAX_LISTING_DESCRIPTION,
} from "../constants/listings";

const ListingAdForm = ({
  pageTitle,
  pageLead,
  submitLabel,
  submitHint,
  ariaPrefix,
  onSubmit,
  onFieldChange,
  values: {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
  },
  images,
}) => {
  const propertyId = `${ariaPrefix}-section-property`;
  const listingId = `${ariaPrefix}-section-listing`;

  const renderImagesFieldset = () => {
    if (images.mode === "create") {
      const {
        inputRef,
        overLimit,
        pendingCount,
        previewUrls,
        onRemovePending,
      } = images;
      return (
        <fieldset className="formFieldset">
          <legend className="formLabel">Images</legend>
          <p className="imagesInfo">
            The first image is the cover. Up to {MAX_LISTING_IMAGES} images (max
            2 MB each).
          </p>
          {overLimit && (
            <p className="imagesLimitWarning" role="alert">
              You selected more than {MAX_LISTING_IMAGES} files. Only the first{" "}
              {MAX_LISTING_IMAGES} were kept.
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            className="formInputFileHidden"
            id="images"
            onChange={onFieldChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <label htmlFor="images" className="formButtonActive formFilePick">
            Choose images
          </label>
          {pendingCount > 0 ? (
            <>
              <p className="imagesPickSummary">
                Selected: {pendingCount} of {MAX_LISTING_IMAGES} images
              </p>
              <ul
                className="imagesPreviewRow"
                aria-label="Selected files preview"
              >
                {previewUrls.map((src, i) => (
                  <li key={`${src}-${i}`}>
                    <div className="imagesPreviewItem">
                      <img
                        src={src}
                        alt={`Selection ${i + 1}`}
                        className="imagesPreviewThumb"
                      />
                      <button
                        type="button"
                        className="imagesPreviewRemove"
                        onClick={() => onRemovePending(i)}
                        aria-label={`Remove selection ${i + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="imagesPickSummary imagesPickSummary--muted">
              No files selected yet (required: at least 1, max{" "}
              {MAX_LISTING_IMAGES}).
            </p>
          )}
        </fieldset>
      );
    }

    const {
      inputRef,
      overLimit,
      pendingCount,
      previewUrls,
      onRemovePending,
      publishedUrls,
      onDeletePublished,
      canAddMore,
    } = images;

    return (
      <>
        <fieldset className="formFieldset">
          <legend className="formLabel">Images</legend>
          <p className="imagesInfo">
            The first published image is the cover. You can add up to{" "}
            {canAddMore} more ({publishedUrls.length} already on this listing,
            max {MAX_LISTING_IMAGES} total, 2 MB each).
          </p>
          {overLimit && (
            <p className="imagesLimitWarning" role="alert">
              You selected more images than allowed. Only the first ones that
              fit the {MAX_LISTING_IMAGES} image limit were kept.
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            className="formInputFileHidden"
            id="images"
            onChange={onFieldChange}
            accept=".jpg,.png,.jpeg"
            multiple
            name="image[]"
          />
          <label htmlFor="images" className="formButtonActive formFilePick">
            Add more images
          </label>
          <p
            className={
              pendingCount > 0
                ? "imagesPickSummary"
                : "imagesPickSummary imagesPickSummary--muted"
            }
          >
            Published: {publishedUrls.length} of {MAX_LISTING_IMAGES}{" "}
            {publishedUrls.length === 1 ? "image" : "images"}
            {pendingCount > 0
              ? ` · New to upload: ${pendingCount}`
              : canAddMore === 0
                ? " · Remove a photo to add a new one."
                : ""}
          </p>
          {pendingCount > 0 && (
            <ul className="imagesPreviewRow" aria-label="New uploads preview">
              {previewUrls.map((src, i) => (
                <li key={`${src}-${i}`}>
                  <div className="imagesPreviewItem">
                    <img
                      src={src}
                      alt={`Pending upload ${i + 1}`}
                      className="imagesPreviewThumb"
                    />
                    <button
                      type="button"
                      className="imagesPreviewRemove"
                      onClick={() => onRemovePending(i)}
                      aria-label={`Remove pending upload ${i + 1}`}
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        {publishedUrls.length > 0 && (
          <div className="createListingPublishedBlock">
            <h3 className="createListingPublishedTitle">
              Photos on this listing
            </h3>
            <div className="createListingPublishedGrid">
              {publishedUrls.map((image, index) => (
                <div key={index} className="presentImage">
                  <img
                    width="75"
                    height="75"
                    src={image}
                    alt={`Published ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="delete"
                    id={image}
                    onClick={onDeletePublished}
                  >
                    <AiTwotoneDelete />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="profile createListingPage">
      <header className="createListingHeader">
        <div>
          <h1 className="pageHeader createListingTitle">{pageTitle}</h1>
          <p className="createListingLead">{pageLead}</p>
        </div>
      </header>
      <main>
        <form onSubmit={onSubmit} className="createListingForm">
          <div className="createListingCard">
            <div className="createListingGrid">
              <section
                className="createListingCol"
                aria-labelledby={propertyId}
              >
                <h2 id={propertyId} className="createListingSectionTitle">
                  Property
                </h2>
                <fieldset className="formFieldset">
                  <legend className="formLabel">Sell / Rent</legend>
                  <div className="formButtons">
                    <button
                      name="type"
                      type="button"
                      value="sell"
                      onClick={onFieldChange}
                      className={
                        type === "sell" ? "formButtonActive" : "formButton"
                      }
                    >
                      Sell
                    </button>
                    <button
                      name="type"
                      type="button"
                      value="rent"
                      onClick={onFieldChange}
                      className={
                        type === "rent" ? "formButtonActive" : "formButton"
                      }
                    >
                      Rent
                    </button>
                  </div>
                </fieldset>
                <label htmlFor="name" className="formLabel">
                  Name
                </label>
                <input
                  className="formInputName"
                  type="text"
                  id="name"
                  value={name}
                  maxLength="50"
                  minLength="10"
                  required="required"
                  onChange={onFieldChange}
                />
                <div className="formRooms">
                  <div>
                    <label htmlFor="bedrooms" className="formLabel">
                      Bedrooms
                    </label>
                    <input
                      className="formInputSmall"
                      type="number"
                      id="bedrooms"
                      value={bedrooms}
                      min="1"
                      max="10"
                      required="required"
                      onChange={onFieldChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="bathrooms" className="formLabel">
                      Bathrooms
                    </label>
                    <input
                      className="formInputSmall"
                      type="number"
                      id="bathrooms"
                      value={bathrooms}
                      min="1"
                      max="10"
                      required="required"
                      onChange={onFieldChange}
                    />
                  </div>
                </div>
                <fieldset className="formFieldset">
                  <legend className="formLabel">Parking Spots</legend>
                  <div className="formButtons">
                    <button
                      name="parking"
                      type="button"
                      value={true}
                      onClick={onFieldChange}
                      className={parking ? "formButtonActive" : "formButton"}
                    >
                      Yes
                    </button>
                    <button
                      name="parking"
                      type="button"
                      value={false}
                      onClick={onFieldChange}
                      className={
                        !parking && parking !== null
                          ? "formButtonActive"
                          : "formButton"
                      }
                    >
                      No
                    </button>
                  </div>
                </fieldset>
                <fieldset className="formFieldset">
                  <legend className="formLabel">Furnished</legend>
                  <div className="formButtons">
                    <button
                      name="furnished"
                      type="button"
                      value={true}
                      onClick={onFieldChange}
                      className={furnished ? "formButtonActive" : "formButton"}
                    >
                      Yes
                    </button>
                    <button
                      name="furnished"
                      type="button"
                      value={false}
                      onClick={onFieldChange}
                      className={
                        !furnished && furnished !== null
                          ? "formButtonActive"
                          : "formButton"
                      }
                    >
                      No
                    </button>
                  </div>
                </fieldset>
              </section>
              <section className="createListingCol" aria-labelledby={listingId}>
                <h2 id={listingId} className="createListingSectionTitle">
                  Listing &amp; media
                </h2>
                <label htmlFor="address" className="formLabel">
                  Address
                </label>
                <input
                  className="formInputName"
                  type="text"
                  id="address"
                  value={address}
                  required="required"
                  onChange={onFieldChange}
                />
                <fieldset className="formFieldset">
                  <legend className="formLabel">Offer</legend>
                  <div className="formButtons">
                    <button
                      name="offer"
                      type="button"
                      value={true}
                      onClick={onFieldChange}
                      className={offer ? "formButtonActive" : "formButton"}
                    >
                      Yes
                    </button>
                    <button
                      name="offer"
                      type="button"
                      value={false}
                      onClick={onFieldChange}
                      className={
                        !offer && offer !== null
                          ? "formButtonActive"
                          : "formButton"
                      }
                    >
                      No
                    </button>
                  </div>
                </fieldset>
                <div
                  className={
                    offer
                      ? "createListingPriceGrid createListingPriceGrid--two"
                      : "createListingPriceGrid"
                  }
                >
                  <div className="createListingPriceField">
                    <label htmlFor="regularPrice" className="formLabel">
                      Regular price (EUR)
                    </label>
                    <div className="formPriceDiv createListingPriceInputRow">
                      <input
                        className="formInputSmall"
                        type="number"
                        id="regularPrice"
                        min="100"
                        max="10000000"
                        value={regularPrice}
                        required="required"
                        onChange={onFieldChange}
                      />
                      {type === "rent" && (
                        <span className="formPriceText">/ month</span>
                      )}
                    </div>
                  </div>
                  {offer && (
                    <div className="createListingPriceField">
                      <label htmlFor="discountedPrice" className="formLabel">
                        Discounted price (EUR)
                      </label>
                      <input
                        className="formInputSmall"
                        type="number"
                        id="discountedPrice"
                        min="100"
                        max="10000000"
                        value={discountedPrice}
                        required={offer}
                        onChange={onFieldChange}
                      />
                    </div>
                  )}
                </div>
                {renderImagesFieldset()}
              </section>
            </div>

            <div className="createListingDescriptionFull">
              <h2
                id="listing-description-heading"
                className="createListingSectionTitle createListingSectionTitle--full"
              >
                Description
              </h2>
              <textarea
                className="formTextarea"
                id="description"
                value={description ?? ""}
                rows={6}
                minLength={MIN_LISTING_DESCRIPTION}
                maxLength={MAX_LISTING_DESCRIPTION}
                required
                placeholder="Describe the property, neighborhood, and anything important for buyers or tenants."
                onChange={onFieldChange}
                aria-labelledby="listing-description-heading"
                aria-describedby="listing-description-hint"
              />
              <p
                id="listing-description-hint"
                className="imagesInfo createListingDescriptionHint"
              >
                {MIN_LISTING_DESCRIPTION}–{MAX_LISTING_DESCRIPTION} characters.
              </p>
            </div>

            <div className="createListingActions">
              <button type="submit" className="createListingSubmit btn-grad">
                {submitLabel}
              </button>
              <p className="createListingActionsHint">{submitHint}</p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ListingAdForm;
