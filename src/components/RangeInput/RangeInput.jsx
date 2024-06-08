import { useState } from "react";
import { ACTION_TYPES } from "../../actions";

function RangeInput({ wordLength, dispatch }) {
  //   const [range, setRange] = useState();
  return (
    <input
      type="range"
      min={5}
      max={8}
      value={wordLength}
      onChange={(e) => {
        dispatch({
          type: ACTION_TYPES.SET_WORD_LENGTH,
          payload: +e.target.value,
        });
        // dispatch({type: ACTION_TYPES.SET_WORD})
      }}
    />
  );
}

export default RangeInput;
