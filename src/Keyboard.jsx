import { keyboard } from "./utils";
import { IoBackspaceOutline } from "react-icons/io5";
function Keyboard({ dispatch }) {
  return (
    <div className="keyboard">
      {keyboard.map((keystroke) => (
        <div
          className="key-stroke"
          data-isSpecial={keystroke.key === "$special$"}
          onClick={() =>
            dispatch({
              type:
                keystroke.code === "Enter"
                  ? "board/enter"
                  : keystroke.code === "Backspace"
                  ? "board/deleteInput"
                  : "board/input",
              payload: { keystroke: keystroke.key, isNative: false },
            })
          }
        >
          {keystroke.key === "$special$" ? (
            <IoBackspaceOutline fontSize={30} />
          ) : (
            keystroke.key
          )}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
