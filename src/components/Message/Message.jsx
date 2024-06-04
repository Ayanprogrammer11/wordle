import { useEffect, useRef } from "react";
import "./Message.css";

function Message({ children, duration }) {
  //   useEffect(
  //     function () {
  //       const timerId = setTimeout(function () {
  //         messageRef.current.classList.add("hidden");
  //       }, duration);
  //       timerRef.current = timerId;

  //       return () => {
  //         clearTimeout(timerRef.current);
  //         timerRef.current = null;
  //         messageRef.current.classList.remove("hidden");
  //       };
  //     },
  //     [duration]
  //   );

  //   useEffect(
  //     function () {
  //       const timerId = setTimeout(function () {
  //         messageRef.current.classList.add("hidden");
  //       }, duration);
  //     },
  //     [duration]
  //   );
  return (
    <div className={`message`}>
      <div className="message__content-container">
        <h4 className="message__content">{children}</h4>
        <p className="message__info">Press any key to continue</p>
      </div>
    </div>
  );
}

export default Message;
