import FeedbackItem from "../components/FeedbackItem";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import FeedbackContext from "../context/FeedbackContext";
import Spinner from "../components/Spinner";

const FeedbackList = ({ deleteFeedback }) => {
  const { feedbacks, isLoading } = useContext(FeedbackContext);

  if ((!feedbacks || feedbacks.length === 0) && !isLoading) {
    return (
      <div className="feedbackEmpty" role="status">
        <p className="feedbackEmptyTitle">No feedback yet</p>
        <p className="feedbackEmptyText">
          Be the first to leave a rating and a short review.
        </p>
      </div>
    );
  }

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="feedbackList">
      <AnimatePresence>
        {feedbacks.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            <FeedbackItem
              key={item.id}
              feedback={item.data}
              id={item.id}
              deleteFeedback={deleteFeedback}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackList;
