import Card from "../components/shared/Card";
import { FaTimes, FaRegEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";
import FeedbackContext from "../context/FeedbackContext";
import { useContext } from "react";

const FeedbackItem = ({ feedback, id, deleteFeedback }) => {
  const { editFeedback } = useContext(FeedbackContext);
  const auth = getAuth();
  return (
    <Card reverse={true}>
      <motion.div
        className="feedbackRatingBadge"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.05, duration: 0.25 }}
      >
        {feedback.rating}
      </motion.div>

      {auth.currentUser
        ? auth.currentUser.uid === feedback.userRef && (
            <>
              <button
                type="button"
                className="feedbackItemBtn feedbackItemBtn--edit"
                aria-label="Edit feedback"
                onClick={() => editFeedback(feedback, id)}
              >
                <FaRegEdit />
              </button>

              <button
                type="button"
                className="feedbackItemBtn feedbackItemBtn--delete"
                aria-label="Delete feedback"
                onClick={() => deleteFeedback(id)}
              >
                <FaTimes />
              </button>
            </>
          )
        : null}

      <div className="feedbackReviewBody">
        <div className="feedbackUserName">{feedback.userName}</div>
        <div className="feedbackText">{feedback.text}</div>
      </div>
    </Card>
  );
};

export default FeedbackItem;
