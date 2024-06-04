import { useCallback, useEffect, useReducer } from "react";
import "./App.css";
import Line from "./Line";
import { generateRandomWord, provideWords, words } from "./utils";
import Keyboard from "./Keyboard";
import Navigation from "./components/Navigation/Navigation";
import { ACTION_TYPES } from "./actions/index";
import Button from "./components/Button/Button";
import { IoLogoGithub } from "react-icons/io5";
import Message from "./components/Message/Message";
import Modal from "./components/Modal/Modal";
import { FaArrowRight } from "react-icons/fa";

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
    case ACTION_TYPES.SET_WORD: {
      return {
        ...state,
        solution: action.payload,
        status: "playing",
      };
    }
    case ACTION_TYPES.INPUT: {
      // FOR MANAGING MESSAGE
      if (state.showMessage.show) {
        return {
          ...state,
          showMessage: { ...state.showMessage, show: false, content: "" },
        };
      }

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
    case ACTION_TYPES.ENTER: {
      // Return if the user presses enter before completing a line
      if (state.currentGuess.tile !== 5) {
        console.log("NO ENTER BEFORE COMPLETING A LINE");
        return {
          ...state,
          showMessage: {
            ...state.showMessage,
            show: true,
            content: "NO ENTER BEFORE COMPLETING A LINE",
          },
        };
      }

      if (state.currentGuess.line < 6) {
        const currentWord = state.guesses[state.currentGuess.line];
        if (
          !provideWords().some((word) => word.toUpperCase() === currentWord)
        ) {
          return {
            ...state,

            showMessage: {
              ...state.showMessage,
              show: true,
              content: "No word found!",
            },
          };
        }
        if (state.solution === currentWord) {
          console.log("WIN!");
          return {
            ...state,
            gameOver: true,
            status: "win",
            currentGuess: {
              ...state.currentGuess,
              line: Infinity,
              tile: 0,
            },
            showModal: true,
          };
        }

        if (state.currentGuess.line === 5) {
          return {
            ...state,
            gameOver: true,
            status: "lose",
            currentGuess: {
              ...state.currentGuess,
              // Using infinity to make the coloring of the last line work because the line state variable should be greater than line which needs to be colored after hitting Enter.
              // I used Infinity rather than a constant number to prevent this from looking a magic number, and for many other beenfits.
              line: Infinity,
              tile: 0,
            },
            showModal: true,
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
    case ACTION_TYPES.DELETE_INPUT: {
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

    case ACTION_TYPES.RESET: {
      if (state.guesses.every((guess) => guess === "")) return state;
      return {
        ...state,
        guesses: Array(6).fill(""),
        currentGuess: {
          line: 0,
          tile: 0,
        },
        gameOver: false,
        status: "playing",
        lettersStatus: [],
      };
    }
    case ACTION_TYPES.LETTERS_STATUS: {
      return {
        ...state,
        lettersStatus: [...state.lettersStatus, action.payload],
      };
    }
    case ACTION_TYPES.CLOSE_MODAL: {
      return { ...state, showModal: false };
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
  // Different statuses: "playing", "win", "lose"
  status: "playing",
  solution: generateRandomWord(),
  //  {status: "", letter: ""}
  lettersStatus: [],
  showMessage: { show: false, content: "" },
  showModal: false,
};

export default function App() {
  const [
    {
      guesses,
      currentGuess,
      solution,
      gameOver,
      lettersStatus,
      showMessage,
      showModal,
      status,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  function handleReset() {
    dispatch({ type: ACTION_TYPES.RESET });
    dispatch({ type: ACTION_TYPES.SET_WORD, payload: generateRandomWord() });
  }

  const handleInput = useCallback(
    (e) => {
      if (e.code === "Enter") {
        dispatch({ type: ACTION_TYPES.ENTER, payload: e });
        return;
      }
      if (e.code === "Backspace") {
        dispatch({ type: ACTION_TYPES.DELETE_INPUT, payload: e });
        return;
      }
      dispatch({ type: ACTION_TYPES.INPUT, payload: e });
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
        <Navigation onReset={handleReset} />
        <div className="board">
          {guesses.map((guess, i) => (
            <Line
              guess={guess}
              index={i}
              key={i}
              currentGuess={currentGuess}
              solution={solution}
              gameOver={gameOver}
              dispatch={dispatch}
              lettersStatus={lettersStatus}
            />
          ))}
          <Keyboard
            dispatch={dispatch}
            gameOver={gameOver}
            lettersStatus={lettersStatus}
          />
          {showMessage.show && <Message>{showMessage.content}</Message>}
          <Modal
            isOpen={showModal}
            onClose={() => dispatch({ type: ACTION_TYPES.CLOSE_MODAL })}
            status={status}
          >
            <p>
              The correct word was: <code>{solution}</code>
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={() => {
                  dispatch({ type: ACTION_TYPES.RESET });
                  dispatch({ type: ACTION_TYPES.CLOSE_MODAL });
                }}
                className="btn"
              >
                Play Again
                <FaArrowRight className="icons" />
              </Button>
            </div>
          </Modal>
        </div>
        <a href="https://github.com/AyanProgrammer11" target="_blank">
          <Button className="btn btn-github">
            <IoLogoGithub className="icons" />
            <span>Github</span>
          </Button>
        </a>
      </div>
    </>
  );
}
