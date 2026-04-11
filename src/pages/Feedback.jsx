import React from "react";
import Modal from "../components/shared/Modal";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackStats from "../components/FeedbackStats";
import FeedbackList from "../components/FeedbackList";
import FeedbackPageHero from "../components/FeedbackPageHero";
import FeedbackContext from "../context/FeedbackContext";
import { useContext } from "react";

const FEEDBACK_HEADING_ID = "feedback-heading";
const FEEDBACK_LEAD_ID = "feedback-lead";

const Feedback = () => {
  const { handleDeleteFalse, handleDeleteTrue, popup, deleteFeedback } =
    useContext(FeedbackContext);

  return (
    <div className="feedbackPage">
      <Modal
        handleDeleteFalse={handleDeleteFalse}
        handleDeleteTrue={handleDeleteTrue}
        popup={popup}
      />
      <main
        className="feedbackPageMain"
        aria-labelledby={FEEDBACK_HEADING_ID}
        aria-describedby={FEEDBACK_LEAD_ID}
      >
        <FeedbackPageHero
          headingId={FEEDBACK_HEADING_ID}
          leadId={FEEDBACK_LEAD_ID}
          title="Feedback"
          description="Rate your experience and share a short note — it helps us improve the platform."
        />
        <FeedbackForm />
        <FeedbackStats />
        <FeedbackList deleteFeedback={deleteFeedback} />
      </main>
    </div>
  );
};

export default Feedback;
