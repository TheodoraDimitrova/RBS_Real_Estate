import React from "react";
import Modal from "../components/shared/Modal";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackStats from "../components/FeedbackStats";
import FeedbackList from "../components/FeedbackList";
import FeedbackContext from "../context/FeedbackContext";
import { useContext } from "react";

function Feedback() {
  const { handleDeleteFalse, handleDeleteTrue, popup, deleteFeedback } =
    useContext(FeedbackContext);

  return (
    <div className="container">
      <Modal
        handleDeleteFalse={handleDeleteFalse}
        handleDeleteTrue={handleDeleteTrue}
        popup={popup}
      />
      <FeedbackForm />
      <FeedbackStats />
      <FeedbackList deleteFeedback={deleteFeedback} />
    </div>
  );
}

export default Feedback;
