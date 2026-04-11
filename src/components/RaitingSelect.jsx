import { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import FeedbackContext from "../context/FeedbackContext";

const RaitingSelect = ({
  selectRatingNum,
  messageRating,
  rating,
}) => {
  const { feedbackEdit } = useContext(FeedbackContext);

  const handleChange = (e) => {
    selectRatingNum(+e.target.value);
  };

  useEffect(() => {}, [feedbackEdit]);

  return (
    <div className="feedbackRatingWrap">
      <ul className="feedbackRating">
        {(() => {
          const li = [];
          for (let i = 1; i <= 10; i += 1) {
            li.push(
              <motion.li key={i} whileHover={{ scale: 1.06 }}>
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
      {messageRating && (
        <div className="feedbackHint feedbackHint--rating">{messageRating}</div>
      )}
    </div>
  );
};

export default RaitingSelect;
