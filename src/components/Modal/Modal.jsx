import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { LiaTimesSolid } from "react-icons/lia";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { LuPartyPopper } from "react-icons/lu";
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
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3
              style={{
                textAlign: "center",
                flex: "1",
              }}
            >
              <span style={{ marginRight: "10px", verticalAlign: "middle" }}>
                You {status === "win" ? "WON" : "LOST"}
              </span>
              {status === "win" ? (
                <customicon className="icons" style={{ fontSize: "30px" }}>
                  🎉
                </customicon>
              ) : (
                <HiOutlineEmojiSad
                  className="icons"
                  fontSize={24}
                  style={{ verticalAlign: "middle" }}
                />
              )}
            </h3>
            <button onClick={handleClose} className="modal-close">
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
