const Card = ({ children, reverse }) => (
  <div
    className={
      reverse ? "feedbackCard feedbackCard--review" : "feedbackCard"
    }
  >
    {children}
  </div>
);

export default Card;
