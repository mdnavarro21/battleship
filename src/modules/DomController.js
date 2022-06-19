import Game from "./Game";
import ShipFactory from "./Ship";

const DomController = (() => {
  const renderMainLayout = () => {
    const main = document.querySelector("main");
    main.append(renderSection(Game.player1));
    main.append(renderSection(Game.player2));
  };

  const renderSection = (player) => {
    const section = document.createElement("section");
    section.id = player.id == "Player 1" ? "player1" : "player2";

    const h1 = document.createElement("h1");
    h1.textContent = player.id;

    const container = document.createElement("div");
    container.classList.add("gameboard-container");
    container.id =
      player.id == "Player 1"
        ? "p1-gameboard-container"
        : "p2-gameboard-container";

    section.append(h1);
    section.append(container);
    if (player.id == "Player 1") {
      container.append(renderGameBoard(player));
      section.append(renderShipyard());
    }

    return section;
  };
  const renderGameBoard = (player) => {
    const gameboard = document.createElement("div");
    gameboard.classList.add("gameboard");
    gameboard.id = player.id == "Player 1" ? "p1-gameboard" : "p2-gameboard";

    const playerBoard = player.gameBoard.getBoard();
    const board_rows = playerBoard.length;
    const board_columns = playerBoard[0].length;
    for (let i = 0; i < board_rows; i++) {
      for (let j = 0; j < board_columns; j++) {
        const boardTile = document.createElement("div");
        boardTile.classList.add("tile");
        const content = document.createElement("div");
        if (player.id == "Player 1") {
          content.innerHTML = playerBoard[i][j] != null ? "&#128674;" : null;

          boardTile.addEventListener("dragover", Drag_and_Drop.allowDrop);
          boardTile.addEventListener("drop", Drag_and_Drop.drop);
        }

        boardTile.append(content);
        boardTile.setAttribute("data-row", i);
        boardTile.setAttribute("data-column", j);
        gameboard.append(boardTile);
      }
    }
    return gameboard;
  };

  const activateEnemyGameboard = () => {
    const tiles = document.querySelectorAll("#p2-gameboard > .tile");
    tiles.forEach((tile) => {
      tile.addEventListener("click", onTileClick);
    });
  };
  const onTileClick = (e) => {
    const dom_tile = e.currentTarget;
    const p1_attack = [
      parseInt(dom_tile.getAttribute("data-column")),
      parseInt(dom_tile.getAttribute("data-row")),
    ];
    const condition = Game.playRound(p1_attack);
    if (condition) {
      const game_tile =
        Game.player2.gameBoard.getBoard()[
          parseInt(dom_tile.getAttribute("data-row"))
        ][parseInt(dom_tile.getAttribute("data-column"))];
      dom_tile.firstChild.innerHTML =
        game_tile == "hit" ? "&#128165;" : "&#10060;";
      updateBoard(Game.player1);
      dom_tile.removeEventListener("click", onTileClick);
    } else {
      const main = document.querySelector("main");
      clearAllChildNodes(main);
      main.append(renderEndScreen());
    }
  };

  const updateBoard = (player) => {
    const tiles = document.querySelectorAll(`#p1-gameboard > .tile`);
    tiles.forEach((tile) => {
      const column = parseInt(tile.getAttribute("data-column"));
      const row = parseInt(tile.getAttribute("data-row"));
      const game_tile = player.gameBoard.getBoard()[row][column];
      tile.firstChild.innerHTML =
        game_tile == "X"
          ? "&#10060;"
          : game_tile == "hit"
          ? "&#128165;"
          : game_tile == null
          ? null
          : "&#128674;";
    });
  };

  const renderShipyard = () => {
    const shipyard = document.createElement("div");
    shipyard.id = "shipyard";

    const shipIDs = [
      "Patrol-Boat",
      "Submarine",
      "Destroyer",
      "Battleship",
      "Carrier",
    ];
    const shipImages = [
      "https://static.thenounproject.com/png/9270-200.png",
      "https://flyclipart.com/thumb2/battleship-boat-marine-military-navy-sea-ship-icon-538526.png",
      "https://static.thenounproject.com/png/1597474-200.png",
      "https://flyclipart.com/thumb2/battleship-boat-military-sea-ship-war-warship-icon-538527.png",
      "https://icon-library.com/images/battleship-icon/battleship-icon-26.jpg",
    ];
    for (let i = 0; i < 5; i++) {
      const div = document.createElement("div");
      const p = document.createElement("p");
      const img = document.createElement("img");

      p.textContent = `Length: ${i + 1}`;
      img.id = shipIDs[i];
      img.draggable = true;
      img.addEventListener("dragstart", Drag_and_Drop.drag);
      img.src = shipImages[i];

      div.append(p);
      div.append(img);
      shipyard.append(div);
    }

    return shipyard;
  };
  const renderEndScreen = () => {
    const end_screen = document.createElement("div");
    end_screen.id = "end-screen";
    end_screen.append(displayWinner(Game.winner));
    end_screen.append(renderPlayAgain());
    return end_screen;
  };

  const displayWinner = (winner) => {
    const div = document.createElement("div");
    div.id = "winning-message";
    const h1 = document.createElement("h1");
    h1.textContent = `${winner.id} is the winner!`;
    div.append(h1);
    return div;
  };

  const renderPlayAgain = () => {
    const button = document.createElement("button");
    button.id = "play-again";
    button.textContent = "Play Again?";
    button.addEventListener("click", () => {
      clearAllChildNodes(document.querySelector("main"));
      Game.start();
      renderMainLayout();
    });
    return button;
  };
  const clearAllChildNodes = (node) => {
    while (node.firstChild) {
      node.removeChild(node.lastChild);
    }
  };

  const Drag_and_Drop = (() => {
    const allowDrop = (e) => {
      e.preventDefault();
    };

    const drag = (e) => {
      e.dataTransfer.setData("text", e.currentTarget.id);
    };

    const drop = (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("text");
      const shipLength =
        data == "Carrier"
          ? 5
          : data == "Battleship"
          ? 4
          : data == "Destroyer"
          ? 3
          : data == "Submarine"
          ? 2
          : 1;
      Game.player1.gameBoard.placeShip(
        ShipFactory(shipLength),
        [
          parseInt(e.currentTarget.getAttribute("data-column")),
          parseInt(e.currentTarget.getAttribute("data-row")),
        ],
        "horizontal"
      );
      updateBoard(Game.player1);
      document
        .querySelector(`#shipyard > div >#${data}`)
        .parentElement.remove();
      if (document.getElementById("shipyard").hasChildNodes() == false) {
        document.querySelector("#shipyard").remove();
        document
          .querySelector("#p2-gameboard-container")
          .append(renderGameBoard(Game.player2));
        activateEnemyGameboard();
      }
    };
    return { allowDrop, drop, drag };
  })();

  return { renderMainLayout };
})();

export default DomController;
