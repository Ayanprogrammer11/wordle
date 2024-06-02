import { useCallback, useEffect, useReducer } from "react";
import "./App.css";
import Line from "./Line";
import { generateRandomWord, words } from "./utils";
import Keyboard from "./Keyboard";

const API_URL =
  "https://random-word-api.herokuapp.com/word?number=30&length=5&lang=es";

function reducer(state, action) {
  function putInput(keyEntered) {
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
  switch (action.type) {
    case "word/set": {
      return {
        ...state,
        solution: action.payload,
        status: "playing",
      };
    }
    case "board/input": {
      if (action.payload.isNative === false) {
        return putInput(action.payload.keystroke);
      }
      // AVOIDING SPAM
      if (action.payload.repeat) return { ...state };
      let keyEntered;
      if (action.payload.code.startsWith("Key"))
        keyEntered = action.payload.code.slice(3);
      if (!keyEntered) return state;

      return putInput(keyEntered);
    }
    case "board/enter": {
      // Return if the user presses enter before completing a line
      if (state.currentGuess.tile !== 5) {
        console.log("NO ENTER BEFORE COMPLETING A LINE");
        return state;
      }

      // Return if no word is found in the word bank
      // if (
      //   !words.some(
      //     (word) =>
      //       state.guesses[state.currentGuess.line] === word.toUpperCase()
      //   )
      // ) {
      //   console.log("NO WORD FOUND!");
      //   return { ...state };
      // }
      if (state.currentGuess.line < 6) {
        const currentWord = state.guesses[state.currentGuess.line];
        if (state.solution === currentWord) {
          console.log("WIN!");
          return {
            ...state,
            gameOver: true,
            currentGuess: {
              ...state.currentGuess,
              line: Infinity,
              tile: 0,
            },
          };
        }

        if (state.currentGuess.line === 5) {
          return {
            ...state,
            gameOver: true,
            currentGuess: {
              ...state.currentGuess,
              // Using infinity to make the coloring of the last line work because the line state variable should be greater than line which needs to be colored after hitting Enter.
              // I used Infinity rather than a constant number to prevent this from looking a magic number, and for many other beenfits.
              line: Infinity,
              tile: 0,
            },
          };
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
  status: "playing",
  solution: generateRandomWord(),
};

export default function App() {
  const [{ guesses, currentGuess, solution, gameOver, status }, dispatch] =
    useReducer(reducer, initialState);

  function handleReset() {
    dispatch({ type: "reset" });
    dispatch({ type: "word/set", payload: generateRandomWord() });
  }

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
    <>
      <div className="app">
        <div className="board">
          {status === "playing" &&
            guesses.map((guess, i) => (
              <Line
                guess={guess}
                index={i}
                key={i}
                currentGuess={currentGuess}
                solution={solution}
                gameOver={gameOver}
              />
            ))}
          <Keyboard dispatch={dispatch} />
        </div>
        {gameOver && (
          <button onClick={handleReset} className="btn btn-reset">
            Reset
          </button>
        )}
      </div>
    </>
  );
}
