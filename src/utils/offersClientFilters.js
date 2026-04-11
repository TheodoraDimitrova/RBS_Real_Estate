/**
 * Parses filter field input for EUR amounts. Handles common EU grouping:
 * `1.300` → 1300, `1,100` → 1100, `1 300` → 1300, `1.300,50` → 1300.5, `9,99` → 9.99.
 * Plain `parseFloat("1.300")` would wrongly yield 1.3.
 * @returns {number} NaN if empty / not a number
 */
export const parseOfferPriceFilterInput = (raw) => {
  if (raw == null) return NaN;
  let s = String(raw)
    .trim()
    .replace(/\s/g, "")
    .replace(/\u00a0/g, "");
  if (s === "") return NaN;

  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
  } else if (lastComma !== -1) {
    const parts = s.split(",");
    if (
      parts.length === 2 &&
      parts[1].length > 0 &&
      parts[1].length <= 2 &&
      /^\d+$/.test(parts[0]) &&
      /^\d+$/.test(parts[1])
    ) {
      s = `${parts[0]}.${parts[1]}`;
    } else {
      s = parts.join("");
    }
  } else if (lastDot !== -1) {
    const parts = s.split(".");
    if (parts.length === 2) {
      const [intPart, fracPart] = parts;
      if (
        /^\d+$/.test(intPart) &&
        fracPart.length === 3 &&
        /^\d{3}$/.test(fracPart)
      ) {
        s = intPart + fracPart;
      }
    } else if (parts.length > 2 && parts.every((p) => /^\d+$/.test(p))) {
      const last = parts[parts.length - 1];
      if (last.length === 3) {
        s = parts.join("");
      }
    }
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
};

/**
 * Coerces stored listing prices (number or string, incl. EU grouping like 1.300).
 * Plain Number() breaks strings such as "1.100" (→ 1.1).
 */
export const parseListingPriceValue = (raw) => {
  if (raw == null || raw === "") return NaN;
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : NaN;
  }
  return parseOfferPriceFilterInput(raw);
};

/** Effective price shown for an offer listing (discounted when present). */
export const getOfferEffectivePrice = (listing) => {
  const d = parseListingPriceValue(listing?.discountedPrice);
  if (Number.isFinite(d) && d >= 0) return d;
  const r = parseListingPriceValue(listing?.regularPrice);
  return Number.isFinite(r) && r >= 0 ? r : NaN;
};

/** Absolute discount in EUR (regular − discounted), or null if not computable. */
export const getOfferDiscountAmountEur = (listing) => {
  const reg = parseListingPriceValue(listing?.regularPrice);
  const disc = parseListingPriceValue(listing?.discountedPrice);
  if (!Number.isFinite(reg) || reg <= 0 || !Number.isFinite(disc)) return null;
  if (disc >= reg) return null;
  return reg - disc;
};

export const listingTimestampMs = (listing) => {
  const t = listing?.timestamp;
  if (t && typeof t.toMillis === "function") return t.toMillis();
  if (typeof t === "number" && Number.isFinite(t)) return t;
  return 0;
};

/**
 * @param {Array<{ id: string, data: object }>} rows
 * @param {{ priceMin: string, priceMax: string, minDiscount: string, sortBy: string }} opts
 */
export const applyOffersClientFilters = (rows, opts) => {
  const { priceMin, priceMax, minDiscount, sortBy } = opts;
  const minP = parseOfferPriceFilterInput(priceMin);
  const maxP = parseOfferPriceFilterInput(priceMax);
  const minOffEur = parseOfferPriceFilterInput(minDiscount);

  let out = rows.map((item) => ({ ...item }));

  out = out.filter(({ data }) => {
    const p = getOfferEffectivePrice(data);
    if (!Number.isFinite(p)) return false;
    if (Number.isFinite(minP) && p < minP) return false;
    if (Number.isFinite(maxP) && p > maxP) return false;
    if (Number.isFinite(minOffEur) && minOffEur > 0) {
      const off = getOfferDiscountAmountEur(data);
      if (off == null || off + 1e-6 < minOffEur) return false;
    }
    return true;
  });

  if (sortBy === "cheapest") {
    out.sort(
      (a, b) =>
        getOfferEffectivePrice(a.data) - getOfferEffectivePrice(b.data),
    );
  } else if (sortBy === "discount") {
    out.sort((a, b) => {
      const da = getOfferDiscountAmountEur(a.data) ?? -1;
      const db = getOfferDiscountAmountEur(b.data) ?? -1;
      return db - da;
    });
  } else {
    out.sort(
      (a, b) => listingTimestampMs(b.data) - listingTimestampMs(a.data),
    );
  }

  return out;
};
