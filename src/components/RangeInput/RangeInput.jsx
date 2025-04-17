import { useState } from "react";
import { ACTION_TYPES } from "../../actions";

function RangeInput({ wordLength, dispatch }) {
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
      }}
    />
  );
}

export default RangeInput;
