import { useContext } from "react";
import FeedbackContext from "../context/FeedbackContext";

export default function FeedbackStats() {
  const { feedbacks } = useContext(FeedbackContext);

  let avarage =
    feedbacks.reduce((acc, cur) => {
      return acc + cur.data.rating;
    }, 0) / feedbacks.length;

  return (
    <div className="feedback-stats">
      <h4>{feedbacks.length} Reviews</h4>
      <h4>
        Avarage rating: {isNaN(Math.round(avarage)) ? 0 : Math.round(avarage)}
      </h4>
    </div>
  );
}
