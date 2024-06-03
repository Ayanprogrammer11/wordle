import { keyboard } from "./utils";
import { IoBackspaceOutline } from "react-icons/io5";
import { ACTION_TYPES } from "./actions/index";

function Keyboard({ gameOver, dispatch, lettersStatus }) {
  return (
    <div className="keyboard">
      {keyboard.map((keystroke) => {
        const letterStatus = lettersStatus.find(
          (status) => status.letter === keystroke.key
        );

        let className = "key-stroke";
        if (letterStatus) {
          // Check for "correct" first (highest priority)
          if (letterStatus.status === "correct") {
            className += " correct";
          } else if (letterStatus.status === "wrong-position") {
            // If previously wrong-position, check all previous guesses for "correct" with the same letter
            const isPreviouslyCorrect = lettersStatus.some(
              (prevStatus) =>
                prevStatus.letter === keystroke.key &&
                prevStatus.status === "correct"
            );

            className += isPreviouslyCorrect ? " correct" : " wrong-position";
          }
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
