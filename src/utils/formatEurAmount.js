export const formatEurAmount = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US");
};

export const formatListingEurAmount = (listing) => {
  const raw = listing?.offer ? listing.discountedPrice : listing.regularPrice;
  return formatEurAmount(raw);
};
