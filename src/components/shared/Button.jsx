import PropTypes from "prop-types";

export default function Button({ children, type, isDesabled }) {
  return (
    <button type={type} disabled={isDesabled} className={`btn`}>
      {children}
    </button>
  );
}

Button.defaultProps = {
  type: "button",
  isDesabled: false,
};
Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  isDesabled: PropTypes.bool,
};
