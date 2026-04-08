import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AuthNoticeModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="backdrop authBackdrop">
      <div className="modal authModal">
        <button onClick={onClose} className="close" aria-label="Close">
          <FaTimes />
        </button>
        <p>Sign in to publish and manage your listings.</p>
        <div className="authModalActions">
          <Link to="/sign-in" className="authModalBtn" onClick={onClose}>
            Sign In
          </Link>
          <Link to="/sign-up" className="authModalBtn" onClick={onClose}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
