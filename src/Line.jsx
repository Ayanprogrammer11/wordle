import React, { useMemo } from "react";

const WORD_LENGTH = 5;

function Line({ guess, currentGuess, index, gameOver, solution }) {
  const tiles = useMemo(() => {
    // TO ACCOUNT FOR CHARACTER OCCURRENCES TO FIX A BUG
    const solutionFrequency = {};
    for (let char of solution) {
      solutionFrequency[char] = (solutionFrequency[char] || 0) + 1;
    }

    const usedChars = {};

    guess.split("").forEach((char, i) => {
      if (char === solution[i]) {
        solutionFrequency[char]--;
        usedChars[i] = char;
      }
    });

    return Array(WORD_LENGTH)
      .fill("")
      .map((_, i) => {
        let className = "tile";
        const char = guess[i];

        if (index < currentGuess.line) {
          if (char === solution[i]) {
            className += " correct";
          } else if (
            solution.includes(char) &&
            solutionFrequency[char] > 0 &&
            !Object.values(usedChars).includes(char)
          ) {
            className += " wrong-position";
            solutionFrequency[char]--;
          } else {
            className += " incorrect";
          }
          // LOGIC FOR ACTIVE TILE COLOR ACTIVATION
        } else if (
          currentGuess.tile > 0 && // Check if the user has started typing
          index === currentGuess.line &&
          i ===
            (currentGuess.tile > 0
              ? currentGuess.tile - 1
              : currentGuess.tile) &&
          !gameOver
        ) {
          className += " active";
        }
        // LOGIC FOR ACTIVE TILE COLOR ACTIVATION FOR THE LAST TILE
        // else if (
        //   index === currentGuess.line &&
        //   i + 1 === 5 &&
        //   currentGuess.tile === 5 &&
        //   !gameOver
        // ) {
        //   className += " active";
        // }

        return (
          <div className={className} key={i}>
            {char}
          </div>
        );
      });
  }, [guess, currentGuess, index, gameOver, solution]);

  return <div className="line">{tiles}</div>;
}

export default Line;
