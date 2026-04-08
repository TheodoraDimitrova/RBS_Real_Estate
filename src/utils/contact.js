/** Strip spaces/dashes for use in tel: href (keeps leading +). */
export function phoneToTelHref(phone) {
  if (typeof phone !== "string") return "";
  return phone.replace(/[\s().-]/g, "").trim();
}
