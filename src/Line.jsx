import React, { useMemo } from "react";
const WORD_LENGTH = 5;
function Line({ guess, currentGuess, index, gameOver, solution }) {
  const tiles = useMemo(() => {
    return Array(WORD_LENGTH)
      .fill("")
      .map((_, i) => {
        let className = "tile";
        if (index < currentGuess.line) {
          if (guess[i] === solution[i]) className += " correct";
          else if (solution.includes(guess[i])) className += " wrong-position";
          else className += " incorrect";
        } else if (
          index === currentGuess.line &&
          i === currentGuess.tile &&
          !gameOver
        ) {
          className += " active";
        } else if (
          index === currentGuess.line &&
          i + 1 === 5 &&
          currentGuess.tile === 5 &&
          !gameOver
        ) {
          className += " active";
        }

        const isDisabled = gameOver && index >= currentGuess.line;

        return (
          <div className={className} key={i} aria-disabled={isDisabled}>
            {guess[i]}
          </div>
        );
      });
  }, [guess, currentGuess, index, gameOver, solution]);

  return <div className="line">{tiles}</div>;
}

export default Line;
