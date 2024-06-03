import React, { useMemo, useEffect } from "react";
import { ACTION_TYPES } from "./actions/index";
const WORD_LENGTH = 5;

function Line({ guess, currentGuess, index, gameOver, solution, dispatch }) {
  // Calculate the tile statuses and store them
  const { tiles, keyboardStatusUpdates } = useMemo(() => {
    const solutionFrequency = {};
    for (let char of solution) {
      solutionFrequency[char] = (solutionFrequency[char] || 0) + 1;
    }

    const usedChars = {};
    const statusUpdates = [];

    guess.split("").forEach((char, i) => {
      if (char === solution[i]) {
        solutionFrequency[char]--;
        usedChars[i] = char;
      }
    });

    const tileElements = Array(WORD_LENGTH)
      .fill("")
      .map((_, i) => {
        let className = "tile";
        const char = guess[i];

        if (index < currentGuess.line) {
          if (char === solution[i]) {
            className += " correct";
            statusUpdates.push({ status: "correct", char });
          } else if (
            solution.includes(char) &&
            solutionFrequency[char] > 0 &&
            !Object.values(usedChars).includes(char)
          ) {
            className += " wrong-position";
            statusUpdates.push({ status: "wrong-position", char });
            solutionFrequency[char]--;
          } else {
            className += " incorrect";
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
          <div className={className} key={i}>
            {char}
          </div>
        );
      });

    return { tiles: tileElements, keyboardStatusUpdates: statusUpdates };
  }, [guess, currentGuess, index, gameOver, solution]);

  // Dispatch keyboard status updates outside of rendering
  useEffect(() => {
    keyboardStatusUpdates.forEach(({ status, char }) => {
      dispatch({
        type: ACTION_TYPES.LETTERS_STATUS,
        payload: { status, letter: char },
      });
    });
  }, [keyboardStatusUpdates, dispatch]);

  return <div className="line">{tiles}</div>;
}

export default Line;
