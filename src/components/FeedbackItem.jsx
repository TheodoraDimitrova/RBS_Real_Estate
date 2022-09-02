import Card from "../components/shared/Card";
import { FaTimes, FaRegEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";
import FeedbackContext from "../context/FeedbackContext";
import { useContext } from "react";

export default function FeedbackItem({ feedback, id, deleteFeedback }) {
  const { editFeedback } = useContext(FeedbackContext);
  const auth = getAuth();
  return (
    <Card reverse={true}>
      <motion.div
        className="num-display"
        animate={{ rotateY: 360 }}
        transition={{ delay: 0.1, duration: 1 }}
      >
        {feedback.rating}
      </motion.div>

      {auth.currentUser
        ? auth.currentUser.uid === feedback.userRef && (
            <>
              <button
                className="edit"
                style={{ color: "#fff" }}
                onClick={() => editFeedback(feedback, id)}
              >
                <FaRegEdit />
              </button>

              <button
                onClick={() => deleteFeedback(id)}
                className="close"
                style={{ color: "#fff" }}
              >
                <FaTimes />
              </button>
            </>
          )
        : ""}

      <div className="text-display">{feedback.userName}</div>
      <div className="text-display">{feedback.text}</div>
    </Card>
  );
}
