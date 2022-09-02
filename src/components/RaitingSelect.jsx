import { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import FeedbackContext from "../context/FeedbackContext";

export default function RaitingSelect({
  selectRatingNum,
  messageRating,
  rating,
}) {
  const { feedbackEdit } = useContext(FeedbackContext);

  const handleChange = (e) => {
    selectRatingNum(+e.target.value);
  };

  useEffect(() => {}, [feedbackEdit]);

  return (
    <div>
      <ul className="rating">
        {(() => {
          let li = [];
          for (let i = 1; i <= 10; i++) {
            li.push(
              <motion.li key={i} whileHover={{ scale: 1.2 }}>
                <input
                  type="radio"
                  id={`num${i}`}
                  name="rating"
                  value={i}
                  onChange={handleChange}
                  checked={rating === i}
                />
                <label htmlFor={`num${i}`}>{i}</label>
              </motion.li>
            );
          }
          return li;
        })()}
      </ul>
      {messageRating && <div className="message">{messageRating}</div>}
    </div>
  );
}
