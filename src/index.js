import DomController from "./modules/DomController";
import Game from "./modules/Game";
import "./styles.css";


window.onload = function() {
    Game.start();
    DomController.renderMainLayout();
}

