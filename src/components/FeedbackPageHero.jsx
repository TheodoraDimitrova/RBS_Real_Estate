const FeedbackPageHero = ({ headingId, leadId, title, description }) => (
  <header className="feedbackPageHero" aria-labelledby={headingId}>
    <div className="feedbackPageHeroInner">
      <h1 id={headingId} className="feedbackPageTitle">
        {title}
      </h1>
      {description ? (
        <p id={leadId} className="feedbackPageLead">
          {description}
        </p>
      ) : null}
    </div>
  </header>
);

export default FeedbackPageHero;
