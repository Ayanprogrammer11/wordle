import { useEffect, useReducer, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./App.css";

const API_URL =
  "https://random-word-api.herokuapp.com/word?number=100&length=5";
const WORD_LENGTH = 5;

function reducer(state, action) {
  switch (action.type) {
    case "board/input": {
      let keyEntered;
      if (action.payload.code.startsWith("Key"))
        keyEntered = action.payload.code.slice(3);
      if (!keyEntered) return { ...state };

      if (state.currentGuess.tile < 5) {
        let guessCopy = [...state.guesses];

        guessCopy[state.currentGuess.line] =
          guessCopy[state.currentGuess.line] + keyEntered;
        console.log("KEY ENTERED:", keyEntered);
        return {
          ...state,
          currentGuess: {
            ...state.currentGuess,
            tile: state.currentGuess.tile + 1,
            content: keyEntered,
          },
          guesses: guessCopy,
        };
      }
      if (state.currentGuess.tile === 5) {
        console.log("END OF LINE");
        return { ...state };
      }
      // return { ...state, currentGuess: { ...state.currentGuess } };
    }
    case "board/enter": {
      // the tile and line states are ZERO-BASED but we dont want to go to next tile before user presses Enter so putting 5 is necessary
      if (state.currentGuess.tile !== 5) {
        console.log("NO ENTER BEFORE COMPLETING A LINE");
        return { ...state };
      }

      if (state.currentGuess.tile === 5 && state.currentGuess.line === 5) {
        console.log("END");
        return { ...state };
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

    case "board/deleteInput": {
      if (state.currentGuess.tile === 0) {
        console.log("NO CHARS TO DELETE");
        return { ...state };
      }
      let guessCopy = [...state.guesses];
      // const currentLineChars =
      const newCopy = guessCopy[state.currentGuess.line].split("");
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
    default:
      throw new Error("Wrong action type!");
  }
}

const initialState = {
  guesses: Array(6).fill(""),
  currentGuess: {
    line: 0,
    tile: 0,
    content: "",
  },
  solution: "hello",
};

export default function App() {
  const [{ guesses, currentGuess, solution }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function handleInput(e) {
    if (e.code === "Enter") {
      dispatch({ type: "board/enter", payload: e });
      return;
    }
    if (e.code === "Backspace") {
      dispatch({ type: "board/deleteInput", payload: e });
    }
    dispatch({ type: "board/input", payload: e });
  }

  useEffect(function () {
    window.addEventListener("keydown", handleInput);

    return () => window.removeEventListener("keydown", handleInput);
  }, []);

  return (
    <div className="board">
      {guesses.map((guess, i) => (
        <Line
          guess={guess}
          index={i}
          key={i}
          currentGuess={currentGuess}
          guesses={guesses}
        />
      ))}
    </div>
  );
}

function Line({ guess, currentGuess, index }) {
  const tiles = [];
  for (let i = 0; i < WORD_LENGTH; i++) {
    tiles.push(
      <div
        className={`tile${
          index === currentGuess.line && i === currentGuess.tile
            ? " active"
            : ""
        }${
          index === currentGuess.line && i + 1 === 5 && currentGuess.tile === 5
            ? " active"
            : ""
        }`}
        key={i}
      >
        {guess[i]}
      </div>
    );
  }
  return <div className="line">{tiles.map((tile) => tile)}</div>;
}
