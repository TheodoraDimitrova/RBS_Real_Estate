export const isOfferDiscountInvalid = (regularPrice, discountedPrice) => {
  const reg = Number(regularPrice);
  const disc = Number(discountedPrice);
  return Number.isFinite(reg) && Number.isFinite(disc) && disc >= reg;
};
