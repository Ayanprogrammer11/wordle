import React, { useEffect, useMemo } from "react";
import { ACTION_TYPES } from "./actions/index";
// const WORD_LENGTH = 5;

function Line({
  index,
  guess,
  currentGuess,
  gameOver,
  solution,
  dispatch,
  WORD_LENGTH,
}) {
  const { tiles, keyboardStatusUpdates } = useMemo(() => {
    const solutionChars = solution?.split("") || [];
    const remainingChars = {};
    const correctPositions = Array(WORD_LENGTH).fill(false);
    const wrongPositions = Array(WORD_LENGTH).fill(false);
    const statusUpdates = [];

    // First pass: mark correct positions
    guess.split("").forEach((char, i) => {
      if (char === solutionChars[i]) {
        correctPositions[i] = true;
      } else if (solutionChars[i]) {
        remainingChars[solutionChars[i]] = (remainingChars[solutionChars[i]] || 0) + 1;
      }
    });

    // Second pass: mark wrong positions
    guess.split("").forEach((char, i) => {
      if (!correctPositions[i] && remainingChars[char] > 0) {
        wrongPositions[i] = true;
        remainingChars[char] -= 1;
      }
    });

    const tileElements = Array(WORD_LENGTH)
      .fill("")
      .map((_, i) => {
        let className = "tile";
        const char = guess[i];
        let tileState = "unrevealed";

        if (currentGuess.line > index) {
          if (correctPositions[i]) {
            className += " correct";
            tileState = "correct";
            statusUpdates.push({ status: "correct", char });
          } else if (wrongPositions[i] && !gameOver) {
            className += " wrong-position";
            tileState = "present";
            statusUpdates.push({ status: "wrong-position", char });
          } else {
            className += " incorrect";
            tileState = "absent";
            statusUpdates.push({ status: "incorrect", char });
          }
        } else if (
          currentGuess.tile > 0 &&
          index === currentGuess.line &&
          i ===
            (currentGuess.tile > 0
              ? currentGuess.tile - 1
              : currentGuess.tile) &&
          !gameOver
        ) {
          className += " active";
          tileState = "active";
        }

        return (
          <div
            key={i}
            className={className}
            role="gridcell"
            aria-label={`Letter ${i + 1}: ${char || "empty"}, ${tileState}`}
          >
            <span className={char ? "visible" : "hidden"}>{char}</span>
          </div>
        );
      });

    return { tiles: tileElements, keyboardStatusUpdates: statusUpdates };
  }, [index, guess, currentGuess, solution, WORD_LENGTH]);

  useEffect(
    function () {
      keyboardStatusUpdates.forEach(({ status, char }) => {
        dispatch({
          type: ACTION_TYPES.LETTERS_STATUS,
          payload: { status, letter: char },
        });
      });
    },
    [keyboardStatusUpdates, dispatch]
  );

  return <div className="line" role="row">{tiles}</div>;
}

export default Line;
