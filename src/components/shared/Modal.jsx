import { FaTimes } from "react-icons/fa";

const Modal = ({ handleDeleteFalse, handleDeleteTrue, popup }) =>
  popup.show && (
    <div className="backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-confirm-title"
      >
        <button
          type="button"
          onClick={handleDeleteFalse}
          className="modalClose"
          aria-label="Close dialog"
        >
          <FaTimes />
        </button>
        <div className="modalBody">
          <p id="modal-confirm-title">Are you sure?</p>
          <button
            type="button"
            className="btn btn-grad modalConfirmBtn"
            onClick={handleDeleteTrue}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

export default Modal;
