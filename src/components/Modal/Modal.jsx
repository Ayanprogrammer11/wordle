import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { LiaTimesSolid } from "react-icons/lia";
import "./Modal.css";

const Modal = ({ isOpen, onClose, status, children }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(onClose, 300); // Wait for the closing animation to finish
  };

  return (
    <CSSTransition
      in={showModal}
      timeout={300}
      classNames="modal"
      unmountOnExit
    >
      <div
        className="modal-overlay"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h3
              id="modal-title"
              style={{
                textAlign: "center",
                flex: "1",
              }}
            >
              {status === "win" ? "You Won! 🎉" : status === "lose" ? "Game Over" : ""}
            </h3>
            <button
              onClick={handleClose}
              className="modal-close"
              aria-label="Close modal"
            >
              <LiaTimesSolid className="icons" />
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Modal;
