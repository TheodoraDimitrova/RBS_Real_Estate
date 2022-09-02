import { FaTimes } from "react-icons/fa";

export default function Modal({ handleDeleteFalse, handleDeleteTrue, popup }) {
  return (
    popup.show && (
      <div className="backdrop">
        <div className="modal">
          <button onClick={handleDeleteFalse} className="close">
            <FaTimes />
          </button>
          <div className="centered">
            <p>Are you sure</p>
            <button className="btn btn-grad" onClick={handleDeleteTrue}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
}
