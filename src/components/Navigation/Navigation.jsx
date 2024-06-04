import "./Navigation.css";
import {
  IoGameControllerOutline,
  IoSettingsSharp,
  IoAddCircleOutline,
  IoFlagOutline,
} from "react-icons/io5";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdNightlight } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import { ACTION_TYPES } from "../../actions/index";
import Button from "../Button/Button";
import { useEffect } from "react";
function Navigation({ onReset, dispatch, darkMode }) {
  useEffect(
    function () {
      const html = document.getElementsByTagName("html")[0];
      darkMode === true
        ? html.classList.add("dark")
        : html.classList.remove("dark");
    },
    [darkMode]
  );
  return (
    <nav className="nav">
      <div className="nav__utils">
        <div className="nav__additional">
          {/* <div className="nav__settings">
            <Button className="nav__btn btn">
              <IoSettingsSharp className="icons" />
              <span>Settings</span>
            </Button>
          </div>
          <div className="challenge">
            <Button className="nav__btn btn">
              <IoAddCircleOutline className="icons" />
              <span>Challenge</span>
            </Button>
          </div> */}
          <div className="dark-mode">
            <Button
              className={"btn btn-toggleMode"}
              onClick={() => dispatch({ type: ACTION_TYPES.TOGGLE_MODE })}
            >
              {darkMode ? (
                <MdNightlight className="icons" />
              ) : (
                <MdOutlineDarkMode className="icons" />
              )}
            </Button>
          </div>
        </div>

        <div className="nav__main">
          <div className="new-game">
            <Button className="nav__btn btn" onClick={onReset}>
              <VscDebugRestart className="icons" />
              <span>New Game</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
