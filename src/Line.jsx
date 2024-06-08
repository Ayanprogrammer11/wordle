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
    const correctPositions = Array(WORD_LENGTH).fill(false);
    const wrongPositions = Array(WORD_LENGTH).fill(false);
    const statusUpdates = [];

    // First pass: mark correct positions
    guess.split("").forEach((char, i) => {
      if (char === solution[i]) {
        correctPositions[i] = true;
      }
    });

    // Second pass: mark wrong positions
    guess.split("").forEach((char, i) => {
      if (!correctPositions[i] && solution.includes(char)) {
        const charIndex = solution.indexOf(char);

        if (
          !correctPositions[charIndex] &&
          !wrongPositions.includes(charIndex)
        ) {
          wrongPositions[i] = true;
        }
      }
    });

    const tileElements = Array(WORD_LENGTH)
      .fill("")
      .map((_, i) => {
        let className = "tile";
        const char = guess[i];

        if (currentGuess.line > index) {
          if (correctPositions[i]) {
            className += " correct";
            statusUpdates.push({ status: "correct", char });
          } else if (wrongPositions[i] && !gameOver) {
            className += " wrong-position";
            statusUpdates.push({ status: "wrong-position", char });
          } else {
            className += " incorrect";
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
        }

        return (
          <div key={i} className={className}>
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

  return <div className="line">{tiles}</div>;
}

export default Line;
