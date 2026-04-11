import { useContext } from "react";
import FeedbackContext from "../context/FeedbackContext";

const FeedbackStats = () => {
  const { feedbacks } = useContext(FeedbackContext);

  const count = feedbacks?.length ?? 0;
  const sum = (feedbacks ?? []).reduce((acc, cur) => acc + cur.data.rating, 0);
  const average = count > 0 ? sum / count : 0;
  const rounded = Number.isFinite(average) ? Math.round(average) : 0;

  return (
    <div className="feedbackStats">
      <p className="feedbackStatsItem">
        <span className="feedbackStatsLabel">Reviews</span>
        <span className="feedbackStatsValue">{count}</span>
      </p>
      <p className="feedbackStatsItem">
        <span className="feedbackStatsLabel">Average rating</span>
        <span className="feedbackStatsValue">{rounded}</span>
      </p>
    </div>
  );
};

export default FeedbackStats;
