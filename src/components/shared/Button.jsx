import PropTypes from "prop-types";

const Button = ({ children, type, isDesabled }) => (
  <button
    type={type}
    disabled={isDesabled}
    className="feedbackSubmitBtn btn-grad"
  >
    {children}
  </button>
);

export default Button;

Button.defaultProps = {
  type: "button",
  isDesabled: false,
};
Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  isDesabled: PropTypes.bool,
};
