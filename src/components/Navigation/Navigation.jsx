import "./Navigation.css";
import {
  IoGameControllerOutline,
  IoSettingsSharp,
  IoAddCircleOutline,
  IoFlagOutline,
} from "react-icons/io5";
import { VscDebugRestart } from "react-icons/vsc";
import Button from "../Button/Button";
function Navigation({ onReset }) {
  return (
    <nav className="nav">
      <div className="nav__utils">
        {/* <div className="nav__additional">
          <div className="nav__settings">
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
          </div>
          <div className="giveup">
            <Button className="nav__btn btn">
              <IoFlagOutline className="icons" />
              <span>Give up</span>
            </Button>
          </div>
        </div> */}

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
