const AuthPageHeader = ({ headingId, leadId, title, description }) => (
  <header className="authHeader" aria-labelledby={headingId}>
    <div className="authHeaderInner">
      <h1 id={headingId} className="authTitle">
        {title}
      </h1>
      {description ? (
        <p id={leadId} className="authSubtitle">
          {description}
        </p>
      ) : null}
    </div>
  </header>
);

export default AuthPageHeader;
