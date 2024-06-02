import { useCallback, useEffect, useReducer, useMemo } from "react";
import "./App.css";
import Line from "./Line";

const API_URL =
  "https://random-word-api.herokuapp.com/word?number=100&length=5";

function reducer(state, action) {
  switch (action.type) {
    case "board/input": {
      let keyEntered;
      if (action.payload.code.startsWith("Key"))
        keyEntered = action.payload.code.slice(3);
      if (!keyEntered) return state;

      if (state.currentGuess.tile < 5) {
        let guessCopy = [...state.guesses];
        guessCopy[state.currentGuess.line] += keyEntered;
        console.log("KEY ENTERED:", keyEntered);

        return {
          ...state,
          currentGuess: {
            ...state.currentGuess,
            tile: state.currentGuess.tile + 1,
          },
          guesses: guessCopy,
        };
      }

      return state;
    }
    case "board/enter": {
      if (state.currentGuess.tile !== 5) {
        console.log("NO ENTER BEFORE COMPLETING A LINE");
        return state;
      }

      if (state.currentGuess.line < 6) {
        const currentWord = state.guesses[state.currentGuess.line];
        if (state.solution === currentWord) {
          console.log("WIN!");
          return {
            ...state,
            gameOver: true,
            currentGuess: {
              ...state.currentGuess,
              line: state.currentGuess.line + 1,
              tile: 0,
            },
          };
        }

        if (state.currentGuess.line === 5) {
          return { ...state, gameOver: true };
        }

        console.log("SHIFTING TO NEXT LINE");
        return {
          ...state,
          currentGuess: {
            ...state.currentGuess,
            tile: 0,
            line: state.currentGuess.line + 1,
          },
        };
      }

      return state;
    }
    case "board/deleteInput": {
      if (state.currentGuess.tile === 0) {
        console.log("NO CHARS TO DELETE");
        return state;
      }

      let guessCopy = [...state.guesses];
      let newCopy = guessCopy[state.currentGuess.line].split("");
      newCopy.splice(state.currentGuess.tile - 1, 1);
      guessCopy[state.currentGuess.line] = newCopy.join("");

      return {
        ...state,
        currentGuess: {
          ...state.currentGuess,
          tile: state.currentGuess.tile - 1,
        },
        guesses: guessCopy,
      };
    }

    case "reset": {
      return {
        ...state,
        guesses: Array(6).fill(""),
        currentGuess: {
          line: 0,
          tile: 0,
        },
        gameOver: false,
      };
    }
    default:
      throw new Error("Wrong action type!");
  }
}

const initialState = {
  guesses: Array(6).fill(""),
  currentGuess: {
    line: 0,
    tile: 0,
  },
  gameOver: false,
  solution: "HELLO",
};

export default function App() {
  const [{ guesses, currentGuess, solution, gameOver }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const handleInput = useCallback(
    (e) => {
      if (e.code === "Enter") {
        dispatch({ type: "board/enter", payload: e });
        return;
      }
      if (e.code === "Backspace") {
        dispatch({ type: "board/deleteInput", payload: e });
        return;
      }
      dispatch({ type: "board/input", payload: e });
    },
    [dispatch]
  );

  useEffect(() => {
    if (gameOver) {
      window.removeEventListener("keydown", handleInput);
      return;
    }
    window.addEventListener("keydown", handleInput);
    return () => window.removeEventListener("keydown", handleInput);
  }, [gameOver, handleInput]);

  return (
    <div className="app">
      <div className="board">
        {guesses.map((guess, i) => (
          <Line
            guess={guess}
            index={i}
            key={i}
            currentGuess={currentGuess}
            solution={solution}
            gameOver={gameOver}
          />
        ))}
      </div>
      {gameOver && (
        <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      )}
    </div>
  );
}
