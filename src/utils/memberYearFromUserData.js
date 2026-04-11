/** Calendar year from a Firestore user doc `timestamp` (Timestamp or plain { seconds }). */
export const memberYearFromUserData = (data) => {
  const ts = data?.timestamp;
  if (ts?.toDate) return ts.toDate().getFullYear();
  if (typeof ts?.seconds === "number") {
    return new Date(ts.seconds * 1000).getFullYear();
  }
  return null;
};
