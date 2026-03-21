import { keyboard } from "./utils";
import { IoBackspaceOutline } from "react-icons/io5";
import { ACTION_TYPES } from "./actions/index";

function Keyboard({ gameOver, dispatch, lettersStatus }) {
  const statusPriority = {
    correct: 3,
    "wrong-position": 2,
    incorrect: 1,
  };

  return (
    <div className="keyboard">
      {keyboard.map((keystroke) => {
        const letterStatus = lettersStatus
          .filter((status) => status.letter === keystroke.key)
          .reduce(
            (bestStatus, currentStatus) =>
              statusPriority[currentStatus.status] >
              statusPriority[bestStatus.status]
                ? currentStatus
                : bestStatus,
            { status: null }
          );

        let className = "key-stroke";
        if (letterStatus.status === "correct") {
          className += " correct";
        } else if (letterStatus.status === "wrong-position") {
          className += " wrong-position";
        } else if (letterStatus.status === "incorrect") {
          className += " incorrect";
        }

        return (
          <div
            className={className}
            data-isspecial={keystroke.key === "$special$"}
            onClick={
              gameOver
                ? () => {}
                : () =>
                    dispatch({
                      type:
                        keystroke.code === "Enter"
                          ? ACTION_TYPES.ENTER
                          : keystroke.code === "Backspace"
                          ? ACTION_TYPES.DELETE_INPUT
                          : ACTION_TYPES.INPUT,
                      payload: { keystroke: keystroke.key, isNative: false },
                    })
            }
            key={keystroke.key}
          >
            {keystroke.key === "$special$" ? (
              <IoBackspaceOutline fontSize={30} />
            ) : (
              keystroke.key
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Keyboard;
