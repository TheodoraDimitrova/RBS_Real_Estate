import Card from "./shared/Card";
import Button from "./shared/Button";
import RatingSelect from "../components/RaitingSelect";
import { motion } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import FeedbackContext from "../context/FeedbackContext";

const FeedbackForm = () => {
  const { feedbackEdit, addFeedback, updateFeedback } =
    useContext(FeedbackContext);

  const [text, setText] = useState("");
  const [rating, setRating] = useState();
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [message, setMessage] = useState("");
  const [messageRating, setMessageRating] = useState("");

  useEffect(() => {
    if (feedbackEdit.edit === true && feedbackEdit.item) {
      setBtnDisabled(false);
      setText(feedbackEdit.item.text);
      setRating(feedbackEdit.item.rating);
    }
  }, [feedbackEdit]);

  const resetForm = () => {
    setBtnDisabled(true);
    setText("");
    setMessage("");
    setMessageRating("");
    setRating(undefined);
  };

  const handleChangeInput = (e) => {
    const value = e.target.value;
    setText(value);

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      setBtnDisabled(true);
      setMessage("");
    } else if (trimmed.length < 10) {
      setBtnDisabled(true);
      setMessage("You should type at least 10 characters.");
    } else {
      setBtnDisabled(false);
      setMessage("");
    }
  };
  const hanleSubmit = async (e) => {
    e.preventDefault();
    if (rating === "" || rating === undefined || rating === null) {
      setMessageRating("Please choose a number");
      return;
    }
    if (text.trim() === "") {
      setMessage("This field can't not be empty");
      return;
    }

    const newFeedback = {
      text: text.trim(),
      rating: parseInt(rating, 10),
    };

    let ok = false;
    if (feedbackEdit.edit === true) {
      ok = await updateFeedback(feedbackEdit.id, newFeedback);
    } else {
      ok = await addFeedback(newFeedback);
    }

    if (ok) {
      resetForm();
    }
  };
  const hanleSelectRatingNum = (r) => {
    setRating(r);
    setMessageRating("");
  };

  return (
    <Card>
      <motion.h2
        className="feedbackCardHeading"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
      >
        How would you rate your experience with us?
      </motion.h2>
      <form onSubmit={hanleSubmit} className="feedbackForm">
        <RatingSelect
          selectRatingNum={hanleSelectRatingNum}
          messageRating={messageRating}
          rating={rating}
        />
        <div className="feedbackInputRow">
          <input
            className="feedbackInput"
            onChange={handleChangeInput}
            type="text"
            placeholder="Write a review"
            value={text}
            autoComplete="off"
          />
          <Button type="submit" version="secondary" isDesabled={btnDisabled}>
            Send
          </Button>
        </div>
        {message && <div className="feedbackHint">{message}</div>}
      </form>
    </Card>
  );
};

export default FeedbackForm;
