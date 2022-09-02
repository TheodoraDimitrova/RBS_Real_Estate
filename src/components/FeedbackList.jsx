import FeedbackItem from "../components/FeedbackItem";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import FeedbackContext from "../context/FeedbackContext";
import Spinner from "../components/Spinner";

export default function FeedbackList({ deleteFeedback }) {
  const { feedbacks, isLoading } = useContext(FeedbackContext);

  if ((!feedbacks || feedbacks.length === 0) && !isLoading) {
    return <p>No feedback yet</p>;
  }

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="feedback-list">
      <AnimatePresence>
        {feedbacks.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: "-1000px" }}
            transition={{ delay: 0.1, duration: 1 }}
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
}
