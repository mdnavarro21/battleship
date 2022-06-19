/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/AI.js":
/*!***************************!*\
  !*** ./src/modules/AI.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ "./src/modules/Player.js");
/* harmony import */ var _Ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Ship */ "./src/modules/Ship.js");



var AIFactory = function AIFactory() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "AI";
  var prototype = (0,_Player__WEBPACK_IMPORTED_MODULE_0__["default"])(id);
  var possible_moves = [];

  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      possible_moves.push([i, j]);
    }
  }

  var randomAttack = function randomAttack() {
    var index = randomIndex();
    var temp = possible_moves[index];
    possible_moves.splice(index, 1);
    return temp;
  };

  var randomIndex = function randomIndex() {
    return Math.floor(Math.random() * possible_moves.length);
  };

  var randomShipPlacement = function randomShipPlacement() {
    prototype.gameBoard.placeShip((0,_Ship__WEBPACK_IMPORTED_MODULE_1__["default"])(5), [0, 0], "horizontal");
    prototype.gameBoard.placeShip((0,_Ship__WEBPACK_IMPORTED_MODULE_1__["default"])(4), [9, 0], "vertical");
    prototype.gameBoard.placeShip((0,_Ship__WEBPACK_IMPORTED_MODULE_1__["default"])(3), [0, 9], "horizontal");
    prototype.gameBoard.placeShip((0,_Ship__WEBPACK_IMPORTED_MODULE_1__["default"])(2), [5, 5], "vertical");
    prototype.gameBoard.placeShip((0,_Ship__WEBPACK_IMPORTED_MODULE_1__["default"])(1), [5, 0], "horizontal");
  };

  return Object.assign({}, prototype, {
    randomAttack: randomAttack,
    randomShipPlacement: randomShipPlacement
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AIFactory);

/***/ }),

/***/ "./src/modules/DomController.js":
/*!**************************************!*\
  !*** ./src/modules/DomController.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game */ "./src/modules/Game.js");
/* harmony import */ var _Ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Ship */ "./src/modules/Ship.js");



var DomController = function () {
  var renderMainLayout = function renderMainLayout() {
    var main = document.querySelector("main");
    main.append(renderSection(_Game__WEBPACK_IMPORTED_MODULE_0__["default"].player1));
    main.append(renderSection(_Game__WEBPACK_IMPORTED_MODULE_0__["default"].player2));
  };

  var renderSection = function renderSection(player) {
    var section = document.createElement("section");
    section.id = player.id == "Player 1" ? "player1" : "player2";
    var h1 = document.createElement("h1");
    h1.textContent = player.id;
    var container = document.createElement("div");
    container.classList.add("gameboard-container");
    container.id = player.id == "Player 1" ? "p1-gameboard-container" : "p2-gameboard-container";
    section.append(h1);
    section.append(container);

    if (player.id == "Player 1") {
      container.append(renderGameBoard(player));
      section.append(renderShipyard());
    }

    return section;
  };

  var renderGameBoard = function renderGameBoard(player) {
    var gameboard = document.createElement("div");
    gameboard.classList.add("gameboard");
    gameboard.id = player.id == "Player 1" ? "p1-gameboard" : "p2-gameboard";
    var playerBoard = player.gameBoard.getBoard();
    var board_rows = playerBoard.length;
    var board_columns = playerBoard[0].length;

    for (var i = 0; i < board_rows; i++) {
      for (var j = 0; j < board_columns; j++) {
        var boardTile = document.createElement("div");
        boardTile.classList.add("tile");
        var content = document.createElement("div");

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

  var activateEnemyGameboard = function activateEnemyGameboard() {
    var tiles = document.querySelectorAll("#p2-gameboard > .tile");
    tiles.forEach(function (tile) {
      tile.addEventListener("click", onTileClick);
    });
  };

  var onTileClick = function onTileClick(e) {
    var dom_tile = e.currentTarget;
    var p1_attack = [parseInt(dom_tile.getAttribute("data-column")), parseInt(dom_tile.getAttribute("data-row"))];
    var condition = _Game__WEBPACK_IMPORTED_MODULE_0__["default"].playRound(p1_attack);

    if (condition) {
      var game_tile = _Game__WEBPACK_IMPORTED_MODULE_0__["default"].player2.gameBoard.getBoard()[parseInt(dom_tile.getAttribute("data-row"))][parseInt(dom_tile.getAttribute("data-column"))];
      dom_tile.firstChild.innerHTML = game_tile == "hit" ? "&#128165;" : "&#10060;";
      updateBoard(_Game__WEBPACK_IMPORTED_MODULE_0__["default"].player1);
      dom_tile.removeEventListener("click", onTileClick);
    } else {
      var main = document.querySelector("main");
      clearAllChildNodes(main);
      main.append(renderEndScreen());
    }
  };

  var updateBoard = function updateBoard(player) {
    var tiles = document.querySelectorAll("#p1-gameboard > .tile");
    tiles.forEach(function (tile) {
      var column = parseInt(tile.getAttribute("data-column"));
      var row = parseInt(tile.getAttribute("data-row"));
      var game_tile = player.gameBoard.getBoard()[row][column];
      tile.firstChild.innerHTML = game_tile == "X" ? "&#10060;" : game_tile == "hit" ? "&#128165;" : game_tile == null ? null : "&#128674;";
    });
  };

  var renderShipyard = function renderShipyard() {
    var shipyard = document.createElement("div");
    shipyard.id = "shipyard";
    var shipIDs = ["Patrol-Boat", "Submarine", "Destroyer", "Battleship", "Carrier"];
    var shipImages = ["https://static.thenounproject.com/png/9270-200.png", "https://flyclipart.com/thumb2/battleship-boat-marine-military-navy-sea-ship-icon-538526.png", "https://static.thenounproject.com/png/1597474-200.png", "https://flyclipart.com/thumb2/battleship-boat-military-sea-ship-war-warship-icon-538527.png", "https://icon-library.com/images/battleship-icon/battleship-icon-26.jpg"];

    for (var i = 0; i < 5; i++) {
      var div = document.createElement("div");
      var p = document.createElement("p");
      var img = document.createElement("img");
      p.textContent = "Length: ".concat(i + 1);
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

  var renderEndScreen = function renderEndScreen() {
    var end_screen = document.createElement("div");
    end_screen.id = "end-screen";
    end_screen.append(displayWinner(_Game__WEBPACK_IMPORTED_MODULE_0__["default"].winner));
    end_screen.append(renderPlayAgain());
    return end_screen;
  };

  var displayWinner = function displayWinner(winner) {
    var div = document.createElement("div");
    div.id = "winning-message";
    var h1 = document.createElement("h1");
    h1.textContent = "".concat(winner.id, " is the winner!");
    div.append(h1);
    return div;
  };

  var renderPlayAgain = function renderPlayAgain() {
    var button = document.createElement("button");
    button.id = "play-again";
    button.textContent = "Play Again?";
    button.addEventListener("click", function () {
      clearAllChildNodes(document.querySelector("main"));
      _Game__WEBPACK_IMPORTED_MODULE_0__["default"].start();
      renderMainLayout();
    });
    return button;
  };

  var clearAllChildNodes = function clearAllChildNodes(node) {
    while (node.firstChild) {
      node.removeChild(node.lastChild);
    }
  };

  var Drag_and_Drop = function () {
    var allowDrop = function allowDrop(e) {
      e.preventDefault();
    };

    var drag = function drag(e) {
      e.dataTransfer.setData("text", e.currentTarget.id);
    };

    var drop = function drop(e) {
      e.preventDefault();
      var data = e.dataTransfer.getData("text");
      var shipLength = data == "Carrier" ? 5 : data == "Battleship" ? 4 : data == "Destroyer" ? 3 : data == "Submarine" ? 2 : 1;
      _Game__WEBPACK_IMPORTED_MODULE_0__["default"].player1.gameBoard.placeShip((0,_Ship__WEBPACK_IMPORTED_MODULE_1__["default"])(shipLength), [parseInt(e.currentTarget.getAttribute("data-column")), parseInt(e.currentTarget.getAttribute("data-row"))], "horizontal");
      updateBoard(_Game__WEBPACK_IMPORTED_MODULE_0__["default"].player1);
      document.querySelector("#shipyard > div >#".concat(data)).parentElement.remove();

      if (document.getElementById("shipyard").hasChildNodes() == false) {
        document.querySelector("#shipyard").remove();
        document.querySelector("#p2-gameboard-container").append(renderGameBoard(_Game__WEBPACK_IMPORTED_MODULE_0__["default"].player2));
        activateEnemyGameboard();
      }
    };

    return {
      allowDrop: allowDrop,
      drop: drop,
      drag: drag
    };
  }();

  return {
    renderMainLayout: renderMainLayout
  };
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DomController);

/***/ }),

/***/ "./src/modules/Game.js":
/*!*****************************!*\
  !*** ./src/modules/Game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ "./src/modules/Player.js");
/* harmony import */ var _AI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AI */ "./src/modules/AI.js");



var Game = function () {
  var player1 = null;
  var player2 = null;
  var winner = null;

  var start = function start() {
    player1 = (0,_Player__WEBPACK_IMPORTED_MODULE_0__["default"])("Player 1");
    player2 = (0,_AI__WEBPACK_IMPORTED_MODULE_1__["default"])("Player 2");
    player2.randomShipPlacement();
  };

  var playRound = function playRound(p1_attack) {
    player1.attack(player2.gameBoard, p1_attack);

    if (player2.gameBoard.allShipsSunk() == true) {
      winner = player1;
      return false;
    }

    player2.attack(player1.gameBoard, player2.randomAttack());

    if (player1.gameBoard.allShipsSunk() == true) {
      winner = player2;
      return false;
    }

    return true;
  };

  return {
    get player1() {
      return player1;
    },

    get player2() {
      return player2;
    },

    get winner() {
      return winner;
    },

    playRound: playRound,
    start: start
  };
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);

/***/ }),

/***/ "./src/modules/Gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/Gameboard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var GameboardFactory = function GameboardFactory() {
  var board = new Array(10).fill().map(function (_) {
    return Array(10).fill(null);
  });
  var placedShips = [];

  var getBoard = function getBoard() {
    return board;
  };

  var getPlacedShips = function getPlacedShips() {
    return placedShips;
  };

  var validatePlacement = function validatePlacement(shipObject, xy_coordinates, direction) {
    var shipLength = shipObject.getLength();

    if (direction == "horizontal") {
      if (xy_coordinates[0] + shipLength > 10) {
        return false;
      }

      for (var i = 0; i < shipLength; i++) {
        if (board[xy_coordinates[1]][xy_coordinates[0] + i] != null) {
          return false;
        }
      }
    } else {
      if (xy_coordinates[1] + shipLength > 10) {
        return false;
      }

      for (var _i = 0; _i < shipLength; _i++) {
        if (board[xy_coordinates[1] + _i][xy_coordinates[0]] != null) {
          return false;
        }
      }
    }

    return true;
  };

  var placeShip = function placeShip(shipObject, xy_coordinates, direction) {
    if (validatePlacement(shipObject, xy_coordinates, direction)) {
      var shipLength = shipObject.getLength();
      var shipID = shipObject.getID();

      if (direction == "horizontal") {
        for (var i = 0; i < shipLength; i++) {
          board[xy_coordinates[1]][xy_coordinates[0] + i] = shipID;
        }
      } else {
        for (var _i2 = 0; _i2 < shipLength; _i2++) {
          board[xy_coordinates[1] + _i2][xy_coordinates[0]] = shipID;
        }
      }

      placedShips.push({
        ship: shipObject,
        start_coordinates: xy_coordinates,
        direction: direction
      });
      return true;
    } else {
      return false;
    }
  };

  var validateAttack = function validateAttack(coordinates) {
    var tile = board[coordinates[1]][coordinates[0]];

    if (tile == "X" || tile == "hit") {
      return false;
    }

    return true;
  };

  var receiveAttack = function receiveAttack(coordinates) {
    if (validateAttack(coordinates)) {
      if (board[coordinates[1]][coordinates[0]] != null) {
        var shipPart = board[coordinates[1]][coordinates[0]];
        var shipPlacementData = placedShips.find(function (data) {
          return data.ship.getID() == shipPart;
        });
        var hitIndex = shipPlacementData.direction == "horizontal" ? coordinates[0] - shipPlacementData.start_coordinates[0] : coordinates[1] - shipPlacementData.start_coordinates[1];
        shipPlacementData.ship.hit(hitIndex);
        board[coordinates[1]][coordinates[0]] = "hit";
      } else {
        board[coordinates[1]][coordinates[0]] = "X";
      }

      return true;
    } else {
      return false;
    }
  };

  var allShipsSunk = function allShipsSunk() {
    return placedShips.every(function (placedShip) {
      return placedShip.ship.isSunk();
    });
  };

  return {
    getBoard: getBoard,
    getPlacedShips: getPlacedShips,
    placeShip: placeShip,
    receiveAttack: receiveAttack,
    allShipsSunk: allShipsSunk
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameboardFactory);

/***/ }),

/***/ "./src/modules/Player.js":
/*!*******************************!*\
  !*** ./src/modules/Player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Gameboard */ "./src/modules/Gameboard.js");


var PlayerFactory = function PlayerFactory(player_id) {
  var id = player_id;
  var gameBoard = (0,_Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();

  var attack = function attack(opponentBoard, coordinates) {
    return opponentBoard.receiveAttack(coordinates);
  };

  return {
    get gameBoard() {
      return gameBoard;
    },

    get id() {
      return id;
    },

    attack: attack
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PlayerFactory);

/***/ }),

/***/ "./src/modules/Ship.js":
/*!*****************************!*\
  !*** ./src/modules/Ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var ShipFactory = function ShipFactory(length) {
  if (!length) {
    throw new Error("No length specified");
  }

  var hits = new Array(length).fill(null);
  var id = length == 5 ? "Carrier" : length == 4 ? "Battleship" : length == 3 ? "Destroyer" : length == 2 ? "Submarine" : "Patrol Boat";

  var getHits = function getHits() {
    return hits;
  };

  var getLength = function getLength() {
    return length;
  };

  var getID = function getID() {
    return id;
  };

  var hit = function hit(index) {
    if (index >= length || index < 0) {
      throw new Error("Ship index out of range");
    }

    hits[index] = "hit";
  };

  var isSunk = function isSunk() {
    return hits.every(function (tile) {
      return tile == "hit";
    });
  };

  return {
    getLength: getLength,
    getHits: getHits,
    getID: getID,
    hit: hit,
    isSunk: isSunk
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ShipFactory);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles.css":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles.css ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  margin: 0;\n  padding: 0;\n}\nbody {\n  background-color: #1e293b;\n  color: white;\n  font-family: Arial, Helvetica, sans-serif;\n}\nheader {\n  text-align: center;\n  font-size: 3vh;\n  font-family: Arial, Helvetica, sans-serif;\n}\nh1 {\n  text-align: center;\n}\n\nmain {\n  display: flex;\n}\n\nsection {\n  height: 100vh;\n  width: 50vw;\n\n  display: grid;\n  grid-template-rows: 5vh 90vh;\n  grid-auto-rows: auto;\n}\n\n.gameboard-container {\n  width: 100%;\n  height: 100%;\n\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.gameboard {\n  background-color: #f1f5f9;\n\n  width: 90%;\n  height: 100%;\n\n  margin: 0;\n  display: grid;\n  grid-template-columns: repeat(10, 10%);\n  grid-template-rows: repeat(10, 1fr);\n}\n\n#shipyard {\n  display: flex;\n  justify-content: space-evenly;\n  color: white;\n}\n\n#shipyard img {\n  height: 10vh;\n  width: 10vh;\n}\n.tile {\n  border-style: solid;\n  color: #1e293b;\n}\n\n.tile > div {\n  font-size: 6vh;\n}\n\n#p2-gameboard > .tile:hover {\n  background-color: #64748b;\n}\n\n#end-screen {\n  height: 100vh;\n  width: 100vw;\n\n  display: grid;\n  grid-template-rows: 80% 20%;\n}\n#winning-message {\n  width: 100%;\n\n  color: white;\n\n  text-align: center;\n\n  font-size: 15vh;\n}\n\n#play-again {\n  font-size: 6vh;\n  width: 24%;\n\n  border-radius: 30px;\n}\n\n#play-again:hover {\n  background-color: #64748b;\n}\n", "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"AAAA;EACE,SAAS;EACT,UAAU;AACZ;AACA;EACE,yBAAyB;EACzB,YAAY;EACZ,yCAAyC;AAC3C;AACA;EACE,kBAAkB;EAClB,cAAc;EACd,yCAAyC;AAC3C;AACA;EACE,kBAAkB;AACpB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,aAAa;EACb,WAAW;;EAEX,aAAa;EACb,4BAA4B;EAC5B,oBAAoB;AACtB;;AAEA;EACE,WAAW;EACX,YAAY;;EAEZ,aAAa;EACb,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,yBAAyB;;EAEzB,UAAU;EACV,YAAY;;EAEZ,SAAS;EACT,aAAa;EACb,sCAAsC;EACtC,mCAAmC;AACrC;;AAEA;EACE,aAAa;EACb,6BAA6B;EAC7B,YAAY;AACd;;AAEA;EACE,YAAY;EACZ,WAAW;AACb;AACA;EACE,mBAAmB;EACnB,cAAc;AAChB;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,aAAa;EACb,YAAY;;EAEZ,aAAa;EACb,2BAA2B;AAC7B;AACA;EACE,WAAW;;EAEX,YAAY;;EAEZ,kBAAkB;;EAElB,eAAe;AACjB;;AAEA;EACE,cAAc;EACd,UAAU;;EAEV,mBAAmB;AACrB;;AAEA;EACE,yBAAyB;AAC3B","sourcesContent":["* {\n  margin: 0;\n  padding: 0;\n}\nbody {\n  background-color: #1e293b;\n  color: white;\n  font-family: Arial, Helvetica, sans-serif;\n}\nheader {\n  text-align: center;\n  font-size: 3vh;\n  font-family: Arial, Helvetica, sans-serif;\n}\nh1 {\n  text-align: center;\n}\n\nmain {\n  display: flex;\n}\n\nsection {\n  height: 100vh;\n  width: 50vw;\n\n  display: grid;\n  grid-template-rows: 5vh 90vh;\n  grid-auto-rows: auto;\n}\n\n.gameboard-container {\n  width: 100%;\n  height: 100%;\n\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.gameboard {\n  background-color: #f1f5f9;\n\n  width: 90%;\n  height: 100%;\n\n  margin: 0;\n  display: grid;\n  grid-template-columns: repeat(10, 10%);\n  grid-template-rows: repeat(10, 1fr);\n}\n\n#shipyard {\n  display: flex;\n  justify-content: space-evenly;\n  color: white;\n}\n\n#shipyard img {\n  height: 10vh;\n  width: 10vh;\n}\n.tile {\n  border-style: solid;\n  color: #1e293b;\n}\n\n.tile > div {\n  font-size: 6vh;\n}\n\n#p2-gameboard > .tile:hover {\n  background-color: #64748b;\n}\n\n#end-screen {\n  height: 100vh;\n  width: 100vw;\n\n  display: grid;\n  grid-template-rows: 80% 20%;\n}\n#winning-message {\n  width: 100%;\n\n  color: white;\n\n  text-align: center;\n\n  font-size: 15vh;\n}\n\n#play-again {\n  font-size: 6vh;\n  width: 24%;\n\n  border-radius: 30px;\n}\n\n#play-again:hover {\n  background-color: #64748b;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./styles.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_DomController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/DomController */ "./src/modules/DomController.js");
/* harmony import */ var _modules_Game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/Game */ "./src/modules/Game.js");
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles.css */ "./src/styles.css");




window.onload = function () {
  _modules_Game__WEBPACK_IMPORTED_MODULE_1__["default"].start();
  _modules_DomController__WEBPACK_IMPORTED_MODULE_0__["default"].renderMainLayout();
};
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQSxhQUFhO0FBQ2I7O0FBRUE7O0FBRUE7QUFDQSx5REFBeUQ7QUFDekQsSUFBSTs7QUFFSjs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7O0FDckVhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztVQ2ZBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTs7QUFFQTRJLE1BQU0sQ0FBQ0MsTUFBUCxHQUFnQixZQUFZO0VBQzFCdkgsMkRBQUE7RUFDQUMsK0VBQUE7QUFDRCxDQUhELEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvQUkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL0RvbUNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL0dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL0dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvUGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9TaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGVzLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMuY3NzPzQ0YjIiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQbGF5ZXJGYWN0b3J5IGZyb20gXCIuL1BsYXllclwiO1xuaW1wb3J0IFNoaXBGYWN0b3J5IGZyb20gXCIuL1NoaXBcIjtcblxuY29uc3QgQUlGYWN0b3J5ID0gKGlkID0gXCJBSVwiKSA9PiB7XG4gIGNvbnN0IHByb3RvdHlwZSA9IFBsYXllckZhY3RvcnkoaWQpO1xuICBsZXQgcG9zc2libGVfbW92ZXMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBwb3NzaWJsZV9tb3Zlcy5wdXNoKFtpLCBqXSk7XG4gICAgfVxuICB9XG4gIGNvbnN0IHJhbmRvbUF0dGFjayA9ICgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IHJhbmRvbUluZGV4KCk7XG4gICAgY29uc3QgdGVtcCA9IHBvc3NpYmxlX21vdmVzW2luZGV4XTtcbiAgICBwb3NzaWJsZV9tb3Zlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiB0ZW1wO1xuICB9O1xuICBjb25zdCByYW5kb21JbmRleCA9ICgpID0+IHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVfbW92ZXMubGVuZ3RoKTtcbiAgfTtcblxuICBjb25zdCByYW5kb21TaGlwUGxhY2VtZW50ID0gKCkgPT4ge1xuICAgIHByb3RvdHlwZS5nYW1lQm9hcmQucGxhY2VTaGlwKFNoaXBGYWN0b3J5KDUpLCBbMCwgMF0sIFwiaG9yaXpvbnRhbFwiKTtcbiAgICBwcm90b3R5cGUuZ2FtZUJvYXJkLnBsYWNlU2hpcChTaGlwRmFjdG9yeSg0KSwgWzksIDBdLCBcInZlcnRpY2FsXCIpO1xuICAgIHByb3RvdHlwZS5nYW1lQm9hcmQucGxhY2VTaGlwKFNoaXBGYWN0b3J5KDMpLCBbMCwgOV0sIFwiaG9yaXpvbnRhbFwiKTtcbiAgICBwcm90b3R5cGUuZ2FtZUJvYXJkLnBsYWNlU2hpcChTaGlwRmFjdG9yeSgyKSwgWzUsIDVdLCBcInZlcnRpY2FsXCIpO1xuICAgIHByb3RvdHlwZS5nYW1lQm9hcmQucGxhY2VTaGlwKFNoaXBGYWN0b3J5KDEpLCBbNSwgMF0sIFwiaG9yaXpvbnRhbFwiKTtcbiAgfTtcblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgcHJvdG90eXBlLCB7IHJhbmRvbUF0dGFjaywgcmFuZG9tU2hpcFBsYWNlbWVudCB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFJRmFjdG9yeTtcbiIsImltcG9ydCBHYW1lIGZyb20gXCIuL0dhbWVcIjtcbmltcG9ydCBTaGlwRmFjdG9yeSBmcm9tIFwiLi9TaGlwXCI7XG5cbmNvbnN0IERvbUNvbnRyb2xsZXIgPSAoKCkgPT4ge1xuICBjb25zdCByZW5kZXJNYWluTGF5b3V0ID0gKCkgPT4ge1xuICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcbiAgICBtYWluLmFwcGVuZChyZW5kZXJTZWN0aW9uKEdhbWUucGxheWVyMSkpO1xuICAgIG1haW4uYXBwZW5kKHJlbmRlclNlY3Rpb24oR2FtZS5wbGF5ZXIyKSk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyU2VjdGlvbiA9IChwbGF5ZXIpID0+IHtcbiAgICBjb25zdCBzZWN0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlY3Rpb25cIik7XG4gICAgc2VjdGlvbi5pZCA9IHBsYXllci5pZCA9PSBcIlBsYXllciAxXCIgPyBcInBsYXllcjFcIiA6IFwicGxheWVyMlwiO1xuXG4gICAgY29uc3QgaDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG4gICAgaDEudGV4dENvbnRlbnQgPSBwbGF5ZXIuaWQ7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiZ2FtZWJvYXJkLWNvbnRhaW5lclwiKTtcbiAgICBjb250YWluZXIuaWQgPVxuICAgICAgcGxheWVyLmlkID09IFwiUGxheWVyIDFcIlxuICAgICAgICA/IFwicDEtZ2FtZWJvYXJkLWNvbnRhaW5lclwiXG4gICAgICAgIDogXCJwMi1nYW1lYm9hcmQtY29udGFpbmVyXCI7XG5cbiAgICBzZWN0aW9uLmFwcGVuZChoMSk7XG4gICAgc2VjdGlvbi5hcHBlbmQoY29udGFpbmVyKTtcbiAgICBpZiAocGxheWVyLmlkID09IFwiUGxheWVyIDFcIikge1xuICAgICAgY29udGFpbmVyLmFwcGVuZChyZW5kZXJHYW1lQm9hcmQocGxheWVyKSk7XG4gICAgICBzZWN0aW9uLmFwcGVuZChyZW5kZXJTaGlweWFyZCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VjdGlvbjtcbiAgfTtcbiAgY29uc3QgcmVuZGVyR2FtZUJvYXJkID0gKHBsYXllcikgPT4ge1xuICAgIGNvbnN0IGdhbWVib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZ2FtZWJvYXJkLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRcIik7XG4gICAgZ2FtZWJvYXJkLmlkID0gcGxheWVyLmlkID09IFwiUGxheWVyIDFcIiA/IFwicDEtZ2FtZWJvYXJkXCIgOiBcInAyLWdhbWVib2FyZFwiO1xuXG4gICAgY29uc3QgcGxheWVyQm9hcmQgPSBwbGF5ZXIuZ2FtZUJvYXJkLmdldEJvYXJkKCk7XG4gICAgY29uc3QgYm9hcmRfcm93cyA9IHBsYXllckJvYXJkLmxlbmd0aDtcbiAgICBjb25zdCBib2FyZF9jb2x1bW5zID0gcGxheWVyQm9hcmRbMF0ubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmRfcm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkX2NvbHVtbnM7IGorKykge1xuICAgICAgICBjb25zdCBib2FyZFRpbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBib2FyZFRpbGUuY2xhc3NMaXN0LmFkZChcInRpbGVcIik7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBpZiAocGxheWVyLmlkID09IFwiUGxheWVyIDFcIikge1xuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gcGxheWVyQm9hcmRbaV1bal0gIT0gbnVsbCA/IFwiJiMxMjg2NzQ7XCIgOiBudWxsO1xuXG4gICAgICAgICAgYm9hcmRUaWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBEcmFnX2FuZF9Ecm9wLmFsbG93RHJvcCk7XG4gICAgICAgICAgYm9hcmRUaWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIERyYWdfYW5kX0Ryb3AuZHJvcCk7XG4gICAgICAgIH1cblxuICAgICAgICBib2FyZFRpbGUuYXBwZW5kKGNvbnRlbnQpO1xuICAgICAgICBib2FyZFRpbGUuc2V0QXR0cmlidXRlKFwiZGF0YS1yb3dcIiwgaSk7XG4gICAgICAgIGJvYXJkVGlsZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbHVtblwiLCBqKTtcbiAgICAgICAgZ2FtZWJvYXJkLmFwcGVuZChib2FyZFRpbGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2FtZWJvYXJkO1xuICB9O1xuXG4gIGNvbnN0IGFjdGl2YXRlRW5lbXlHYW1lYm9hcmQgPSAoKSA9PiB7XG4gICAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3AyLWdhbWVib2FyZCA+IC50aWxlXCIpO1xuICAgIHRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcbiAgICAgIHRpbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9uVGlsZUNsaWNrKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgb25UaWxlQ2xpY2sgPSAoZSkgPT4ge1xuICAgIGNvbnN0IGRvbV90aWxlID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgIGNvbnN0IHAxX2F0dGFjayA9IFtcbiAgICAgIHBhcnNlSW50KGRvbV90aWxlLmdldEF0dHJpYnV0ZShcImRhdGEtY29sdW1uXCIpKSxcbiAgICAgIHBhcnNlSW50KGRvbV90aWxlLmdldEF0dHJpYnV0ZShcImRhdGEtcm93XCIpKSxcbiAgICBdO1xuICAgIGNvbnN0IGNvbmRpdGlvbiA9IEdhbWUucGxheVJvdW5kKHAxX2F0dGFjayk7XG4gICAgaWYgKGNvbmRpdGlvbikge1xuICAgICAgY29uc3QgZ2FtZV90aWxlID1cbiAgICAgICAgR2FtZS5wbGF5ZXIyLmdhbWVCb2FyZC5nZXRCb2FyZCgpW1xuICAgICAgICAgIHBhcnNlSW50KGRvbV90aWxlLmdldEF0dHJpYnV0ZShcImRhdGEtcm93XCIpKVxuICAgICAgICBdW3BhcnNlSW50KGRvbV90aWxlLmdldEF0dHJpYnV0ZShcImRhdGEtY29sdW1uXCIpKV07XG4gICAgICBkb21fdGlsZS5maXJzdENoaWxkLmlubmVySFRNTCA9XG4gICAgICAgIGdhbWVfdGlsZSA9PSBcImhpdFwiID8gXCImIzEyODE2NTtcIiA6IFwiJiMxMDA2MDtcIjtcbiAgICAgIHVwZGF0ZUJvYXJkKEdhbWUucGxheWVyMSk7XG4gICAgICBkb21fdGlsZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb25UaWxlQ2xpY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIik7XG4gICAgICBjbGVhckFsbENoaWxkTm9kZXMobWFpbik7XG4gICAgICBtYWluLmFwcGVuZChyZW5kZXJFbmRTY3JlZW4oKSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHVwZGF0ZUJvYXJkID0gKHBsYXllcikgPT4ge1xuICAgIGNvbnN0IHRpbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgI3AxLWdhbWVib2FyZCA+IC50aWxlYCk7XG4gICAgdGlsZXMuZm9yRWFjaCgodGlsZSkgPT4ge1xuICAgICAgY29uc3QgY29sdW1uID0gcGFyc2VJbnQodGlsZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbHVtblwiKSk7XG4gICAgICBjb25zdCByb3cgPSBwYXJzZUludCh0aWxlLmdldEF0dHJpYnV0ZShcImRhdGEtcm93XCIpKTtcbiAgICAgIGNvbnN0IGdhbWVfdGlsZSA9IHBsYXllci5nYW1lQm9hcmQuZ2V0Qm9hcmQoKVtyb3ddW2NvbHVtbl07XG4gICAgICB0aWxlLmZpcnN0Q2hpbGQuaW5uZXJIVE1MID1cbiAgICAgICAgZ2FtZV90aWxlID09IFwiWFwiXG4gICAgICAgICAgPyBcIiYjMTAwNjA7XCJcbiAgICAgICAgICA6IGdhbWVfdGlsZSA9PSBcImhpdFwiXG4gICAgICAgICAgPyBcIiYjMTI4MTY1O1wiXG4gICAgICAgICAgOiBnYW1lX3RpbGUgPT0gbnVsbFxuICAgICAgICAgID8gbnVsbFxuICAgICAgICAgIDogXCImIzEyODY3NDtcIjtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJTaGlweWFyZCA9ICgpID0+IHtcbiAgICBjb25zdCBzaGlweWFyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgc2hpcHlhcmQuaWQgPSBcInNoaXB5YXJkXCI7XG5cbiAgICBjb25zdCBzaGlwSURzID0gW1xuICAgICAgXCJQYXRyb2wtQm9hdFwiLFxuICAgICAgXCJTdWJtYXJpbmVcIixcbiAgICAgIFwiRGVzdHJveWVyXCIsXG4gICAgICBcIkJhdHRsZXNoaXBcIixcbiAgICAgIFwiQ2FycmllclwiLFxuICAgIF07XG4gICAgY29uc3Qgc2hpcEltYWdlcyA9IFtcbiAgICAgIFwiaHR0cHM6Ly9zdGF0aWMudGhlbm91bnByb2plY3QuY29tL3BuZy85MjcwLTIwMC5wbmdcIixcbiAgICAgIFwiaHR0cHM6Ly9mbHljbGlwYXJ0LmNvbS90aHVtYjIvYmF0dGxlc2hpcC1ib2F0LW1hcmluZS1taWxpdGFyeS1uYXZ5LXNlYS1zaGlwLWljb24tNTM4NTI2LnBuZ1wiLFxuICAgICAgXCJodHRwczovL3N0YXRpYy50aGVub3VucHJvamVjdC5jb20vcG5nLzE1OTc0NzQtMjAwLnBuZ1wiLFxuICAgICAgXCJodHRwczovL2ZseWNsaXBhcnQuY29tL3RodW1iMi9iYXR0bGVzaGlwLWJvYXQtbWlsaXRhcnktc2VhLXNoaXAtd2FyLXdhcnNoaXAtaWNvbi01Mzg1MjcucG5nXCIsXG4gICAgICBcImh0dHBzOi8vaWNvbi1saWJyYXJ5LmNvbS9pbWFnZXMvYmF0dGxlc2hpcC1pY29uL2JhdHRsZXNoaXAtaWNvbi0yNi5qcGdcIixcbiAgICBdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblxuICAgICAgcC50ZXh0Q29udGVudCA9IGBMZW5ndGg6ICR7aSArIDF9YDtcbiAgICAgIGltZy5pZCA9IHNoaXBJRHNbaV07XG4gICAgICBpbWcuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIERyYWdfYW5kX0Ryb3AuZHJhZyk7XG4gICAgICBpbWcuc3JjID0gc2hpcEltYWdlc1tpXTtcblxuICAgICAgZGl2LmFwcGVuZChwKTtcbiAgICAgIGRpdi5hcHBlbmQoaW1nKTtcbiAgICAgIHNoaXB5YXJkLmFwcGVuZChkaXYpO1xuICAgIH1cblxuICAgIHJldHVybiBzaGlweWFyZDtcbiAgfTtcbiAgY29uc3QgcmVuZGVyRW5kU2NyZWVuID0gKCkgPT4ge1xuICAgIGNvbnN0IGVuZF9zY3JlZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGVuZF9zY3JlZW4uaWQgPSBcImVuZC1zY3JlZW5cIjtcbiAgICBlbmRfc2NyZWVuLmFwcGVuZChkaXNwbGF5V2lubmVyKEdhbWUud2lubmVyKSk7XG4gICAgZW5kX3NjcmVlbi5hcHBlbmQocmVuZGVyUGxheUFnYWluKCkpO1xuICAgIHJldHVybiBlbmRfc2NyZWVuO1xuICB9O1xuXG4gIGNvbnN0IGRpc3BsYXlXaW5uZXIgPSAod2lubmVyKSA9PiB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXYuaWQgPSBcIndpbm5pbmctbWVzc2FnZVwiO1xuICAgIGNvbnN0IGgxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuICAgIGgxLnRleHRDb250ZW50ID0gYCR7d2lubmVyLmlkfSBpcyB0aGUgd2lubmVyIWA7XG4gICAgZGl2LmFwcGVuZChoMSk7XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQbGF5QWdhaW4gPSAoKSA9PiB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBidXR0b24uaWQgPSBcInBsYXktYWdhaW5cIjtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSBcIlBsYXkgQWdhaW4/XCI7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBjbGVhckFsbENoaWxkTm9kZXMoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIikpO1xuICAgICAgR2FtZS5zdGFydCgpO1xuICAgICAgcmVuZGVyTWFpbkxheW91dCgpO1xuICAgIH0pO1xuICAgIHJldHVybiBidXR0b247XG4gIH07XG4gIGNvbnN0IGNsZWFyQWxsQ2hpbGROb2RlcyA9IChub2RlKSA9PiB7XG4gICAgd2hpbGUgKG5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgbm9kZS5yZW1vdmVDaGlsZChub2RlLmxhc3RDaGlsZCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IERyYWdfYW5kX0Ryb3AgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGFsbG93RHJvcCA9IChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGRyYWcgPSAoZSkgPT4ge1xuICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHRcIiwgZS5jdXJyZW50VGFyZ2V0LmlkKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZHJvcCA9IChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBkYXRhID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHRcIik7XG4gICAgICBjb25zdCBzaGlwTGVuZ3RoID1cbiAgICAgICAgZGF0YSA9PSBcIkNhcnJpZXJcIlxuICAgICAgICAgID8gNVxuICAgICAgICAgIDogZGF0YSA9PSBcIkJhdHRsZXNoaXBcIlxuICAgICAgICAgID8gNFxuICAgICAgICAgIDogZGF0YSA9PSBcIkRlc3Ryb3llclwiXG4gICAgICAgICAgPyAzXG4gICAgICAgICAgOiBkYXRhID09IFwiU3VibWFyaW5lXCJcbiAgICAgICAgICA/IDJcbiAgICAgICAgICA6IDE7XG4gICAgICBHYW1lLnBsYXllcjEuZ2FtZUJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgU2hpcEZhY3Rvcnkoc2hpcExlbmd0aCksXG4gICAgICAgIFtcbiAgICAgICAgICBwYXJzZUludChlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb2x1bW5cIikpLFxuICAgICAgICAgIHBhcnNlSW50KGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXJvd1wiKSksXG4gICAgICAgIF0sXG4gICAgICAgIFwiaG9yaXpvbnRhbFwiXG4gICAgICApO1xuICAgICAgdXBkYXRlQm9hcmQoR2FtZS5wbGF5ZXIxKTtcbiAgICAgIGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKGAjc2hpcHlhcmQgPiBkaXYgPiMke2RhdGF9YClcbiAgICAgICAgLnBhcmVudEVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaGlweWFyZFwiKS5oYXNDaGlsZE5vZGVzKCkgPT0gZmFsc2UpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzaGlweWFyZFwiKS5yZW1vdmUoKTtcbiAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAucXVlcnlTZWxlY3RvcihcIiNwMi1nYW1lYm9hcmQtY29udGFpbmVyXCIpXG4gICAgICAgICAgLmFwcGVuZChyZW5kZXJHYW1lQm9hcmQoR2FtZS5wbGF5ZXIyKSk7XG4gICAgICAgIGFjdGl2YXRlRW5lbXlHYW1lYm9hcmQoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiB7IGFsbG93RHJvcCwgZHJvcCwgZHJhZyB9O1xuICB9KSgpO1xuXG4gIHJldHVybiB7IHJlbmRlck1haW5MYXlvdXQgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IERvbUNvbnRyb2xsZXI7XG4iLCJpbXBvcnQgUGxheWVyRmFjdG9yeSBmcm9tIFwiLi9QbGF5ZXJcIjtcbmltcG9ydCBBSUZhY3RvcnkgZnJvbSBcIi4vQUlcIjtcblxuY29uc3QgR2FtZSA9ICgoKSA9PiB7XG4gIGxldCBwbGF5ZXIxID0gbnVsbDtcbiAgbGV0IHBsYXllcjIgPSBudWxsO1xuICBsZXQgd2lubmVyID0gbnVsbDtcblxuICBjb25zdCBzdGFydCA9ICgpID0+IHtcbiAgICBwbGF5ZXIxID0gUGxheWVyRmFjdG9yeShcIlBsYXllciAxXCIpO1xuICAgIHBsYXllcjIgPSBBSUZhY3RvcnkoXCJQbGF5ZXIgMlwiKTtcbiAgICBwbGF5ZXIyLnJhbmRvbVNoaXBQbGFjZW1lbnQoKTtcbiAgfTtcblxuICBjb25zdCBwbGF5Um91bmQgPSAocDFfYXR0YWNrKSA9PiB7XG4gICAgcGxheWVyMS5hdHRhY2socGxheWVyMi5nYW1lQm9hcmQsIHAxX2F0dGFjayk7XG4gICAgaWYgKHBsYXllcjIuZ2FtZUJvYXJkLmFsbFNoaXBzU3VuaygpID09IHRydWUpIHtcbiAgICAgIHdpbm5lciA9IHBsYXllcjE7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHBsYXllcjIuYXR0YWNrKHBsYXllcjEuZ2FtZUJvYXJkLCBwbGF5ZXIyLnJhbmRvbUF0dGFjaygpKTtcbiAgICBpZiAocGxheWVyMS5nYW1lQm9hcmQuYWxsU2hpcHNTdW5rKCkgPT0gdHJ1ZSkge1xuICAgICAgd2lubmVyID0gcGxheWVyMjtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgcGxheWVyMSgpIHtcbiAgICAgIHJldHVybiBwbGF5ZXIxO1xuICAgIH0sXG4gICAgZ2V0IHBsYXllcjIoKSB7XG4gICAgICByZXR1cm4gcGxheWVyMjtcbiAgICB9LFxuICAgIGdldCB3aW5uZXIoKSB7XG4gICAgICByZXR1cm4gd2lubmVyO1xuICAgIH0sXG4gICAgcGxheVJvdW5kLFxuICAgIHN0YXJ0LFxuICB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImNvbnN0IEdhbWVib2FyZEZhY3RvcnkgPSAoKSA9PiB7XG4gIGxldCBib2FyZCA9IG5ldyBBcnJheSgxMCkuZmlsbCgpLm1hcCgoXykgPT4gQXJyYXkoMTApLmZpbGwobnVsbCkpO1xuICBsZXQgcGxhY2VkU2hpcHMgPSBbXTtcblxuICBjb25zdCBnZXRCb2FyZCA9ICgpID0+IGJvYXJkO1xuICBjb25zdCBnZXRQbGFjZWRTaGlwcyA9ICgpID0+IHBsYWNlZFNoaXBzO1xuXG4gIGNvbnN0IHZhbGlkYXRlUGxhY2VtZW50ID0gKHNoaXBPYmplY3QsIHh5X2Nvb3JkaW5hdGVzLCBkaXJlY3Rpb24pID0+IHtcbiAgICBjb25zdCBzaGlwTGVuZ3RoID0gc2hpcE9iamVjdC5nZXRMZW5ndGgoKTtcbiAgICBpZiAoZGlyZWN0aW9uID09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBpZiAoeHlfY29vcmRpbmF0ZXNbMF0gKyBzaGlwTGVuZ3RoID4gMTApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJvYXJkW3h5X2Nvb3JkaW5hdGVzWzFdXVt4eV9jb29yZGluYXRlc1swXSArIGldICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHh5X2Nvb3JkaW5hdGVzWzFdICsgc2hpcExlbmd0aCA+IDEwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChib2FyZFt4eV9jb29yZGluYXRlc1sxXSArIGldW3h5X2Nvb3JkaW5hdGVzWzBdXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IChzaGlwT2JqZWN0LCB4eV9jb29yZGluYXRlcywgZGlyZWN0aW9uKSA9PiB7XG4gICAgaWYgKHZhbGlkYXRlUGxhY2VtZW50KHNoaXBPYmplY3QsIHh5X2Nvb3JkaW5hdGVzLCBkaXJlY3Rpb24pKSB7XG4gICAgICBjb25zdCBzaGlwTGVuZ3RoID0gc2hpcE9iamVjdC5nZXRMZW5ndGgoKTtcbiAgICAgIGNvbnN0IHNoaXBJRCA9IHNoaXBPYmplY3QuZ2V0SUQoKTtcbiAgICAgIGlmIChkaXJlY3Rpb24gPT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBib2FyZFt4eV9jb29yZGluYXRlc1sxXV1beHlfY29vcmRpbmF0ZXNbMF0gKyBpXSA9IHNoaXBJRDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBib2FyZFt4eV9jb29yZGluYXRlc1sxXSArIGldW3h5X2Nvb3JkaW5hdGVzWzBdXSA9IHNoaXBJRDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcGxhY2VkU2hpcHMucHVzaCh7XG4gICAgICAgIHNoaXA6IHNoaXBPYmplY3QsXG4gICAgICAgIHN0YXJ0X2Nvb3JkaW5hdGVzOiB4eV9jb29yZGluYXRlcyxcbiAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgdmFsaWRhdGVBdHRhY2sgPSAoY29vcmRpbmF0ZXMpID0+IHtcbiAgICBjb25zdCB0aWxlID0gYm9hcmRbY29vcmRpbmF0ZXNbMV1dW2Nvb3JkaW5hdGVzWzBdXTtcbiAgICBpZiAodGlsZSA9PSBcIlhcIiB8fCB0aWxlID09IFwiaGl0XCIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9IChjb29yZGluYXRlcykgPT4ge1xuICAgIGlmICh2YWxpZGF0ZUF0dGFjayhjb29yZGluYXRlcykpIHtcbiAgICAgIGlmIChib2FyZFtjb29yZGluYXRlc1sxXV1bY29vcmRpbmF0ZXNbMF1dICE9IG51bGwpIHtcbiAgICAgICAgY29uc3Qgc2hpcFBhcnQgPSBib2FyZFtjb29yZGluYXRlc1sxXV1bY29vcmRpbmF0ZXNbMF1dO1xuICAgICAgICBsZXQgc2hpcFBsYWNlbWVudERhdGEgPSBwbGFjZWRTaGlwcy5maW5kKFxuICAgICAgICAgIChkYXRhKSA9PiBkYXRhLnNoaXAuZ2V0SUQoKSA9PSBzaGlwUGFydFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBoaXRJbmRleCA9XG4gICAgICAgICAgc2hpcFBsYWNlbWVudERhdGEuZGlyZWN0aW9uID09IFwiaG9yaXpvbnRhbFwiXG4gICAgICAgICAgICA/IGNvb3JkaW5hdGVzWzBdIC0gc2hpcFBsYWNlbWVudERhdGEuc3RhcnRfY29vcmRpbmF0ZXNbMF1cbiAgICAgICAgICAgIDogY29vcmRpbmF0ZXNbMV0gLSBzaGlwUGxhY2VtZW50RGF0YS5zdGFydF9jb29yZGluYXRlc1sxXTtcbiAgICAgICAgc2hpcFBsYWNlbWVudERhdGEuc2hpcC5oaXQoaGl0SW5kZXgpO1xuICAgICAgICBib2FyZFtjb29yZGluYXRlc1sxXV1bY29vcmRpbmF0ZXNbMF1dID0gXCJoaXRcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvYXJkW2Nvb3JkaW5hdGVzWzFdXVtjb29yZGluYXRlc1swXV0gPSBcIlhcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFsbFNoaXBzU3VuayA9ICgpID0+IHtcbiAgICByZXR1cm4gcGxhY2VkU2hpcHMuZXZlcnkoKHBsYWNlZFNoaXApID0+IHtcbiAgICAgIHJldHVybiBwbGFjZWRTaGlwLnNoaXAuaXNTdW5rKCk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiB7IGdldEJvYXJkLCBnZXRQbGFjZWRTaGlwcywgcGxhY2VTaGlwLCByZWNlaXZlQXR0YWNrLCBhbGxTaGlwc1N1bmsgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZEZhY3Rvcnk7XG4iLCJpbXBvcnQgR2FtZWJvYXJkRmFjdG9yeSBmcm9tIFwiLi9HYW1lYm9hcmRcIjtcblxuY29uc3QgUGxheWVyRmFjdG9yeSA9IChwbGF5ZXJfaWQpID0+IHtcbiAgY29uc3QgaWQgPSBwbGF5ZXJfaWQ7XG4gIGxldCBnYW1lQm9hcmQgPSBHYW1lYm9hcmRGYWN0b3J5KCk7XG5cbiAgY29uc3QgYXR0YWNrID0gKG9wcG9uZW50Qm9hcmQsIGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgcmV0dXJuIG9wcG9uZW50Qm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlcyk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgZ2FtZUJvYXJkKCkge1xuICAgICAgcmV0dXJuIGdhbWVCb2FyZDtcbiAgICB9LFxuICAgIGdldCBpZCgpIHtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9LFxuICAgIGF0dGFjayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllckZhY3Rvcnk7XG4iLCJjb25zdCBTaGlwRmFjdG9yeSA9IChsZW5ndGgpID0+IHtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBsZW5ndGggc3BlY2lmaWVkXCIpO1xuICB9XG4gIGxldCBoaXRzID0gbmV3IEFycmF5KGxlbmd0aCkuZmlsbChudWxsKTtcbiAgbGV0IGlkID1cbiAgICBsZW5ndGggPT0gNVxuICAgICAgPyBcIkNhcnJpZXJcIlxuICAgICAgOiBsZW5ndGggPT0gNFxuICAgICAgPyBcIkJhdHRsZXNoaXBcIlxuICAgICAgOiBsZW5ndGggPT0gM1xuICAgICAgPyBcIkRlc3Ryb3llclwiXG4gICAgICA6IGxlbmd0aCA9PSAyXG4gICAgICA/IFwiU3VibWFyaW5lXCJcbiAgICAgIDogXCJQYXRyb2wgQm9hdFwiO1xuXG4gIGNvbnN0IGdldEhpdHMgPSAoKSA9PiBoaXRzO1xuICBjb25zdCBnZXRMZW5ndGggPSAoKSA9PiBsZW5ndGg7XG4gIGNvbnN0IGdldElEID0gKCkgPT4gaWQ7XG5cbiAgY29uc3QgaGl0ID0gKGluZGV4KSA9PiB7XG4gICAgaWYgKGluZGV4ID49IGxlbmd0aCB8fCBpbmRleCA8IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNoaXAgaW5kZXggb3V0IG9mIHJhbmdlXCIpO1xuICAgIH1cbiAgICBoaXRzW2luZGV4XSA9IFwiaGl0XCI7XG4gIH07XG5cbiAgY29uc3QgaXNTdW5rID0gKCkgPT4ge1xuICAgIHJldHVybiBoaXRzLmV2ZXJ5KCh0aWxlKSA9PiB0aWxlID09IFwiaGl0XCIpO1xuICB9O1xuXG4gIHJldHVybiB7IGdldExlbmd0aCwgZ2V0SGl0cywgZ2V0SUQsIGhpdCwgaXNTdW5rIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBTaGlwRmFjdG9yeTtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiKiB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG5ib2R5IHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMxZTI5M2I7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG59XFxuaGVhZGVyIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogM3ZoO1xcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxufVxcbmgxIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxubWFpbiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbn1cXG5cXG5zZWN0aW9uIHtcXG4gIGhlaWdodDogMTAwdmg7XFxuICB3aWR0aDogNTB2dztcXG5cXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDV2aCA5MHZoO1xcbiAgZ3JpZC1hdXRvLXJvd3M6IGF1dG87XFxufVxcblxcbi5nYW1lYm9hcmQtY29udGFpbmVyIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcblxcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLmdhbWVib2FyZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjFmNWY5O1xcblxcbiAgd2lkdGg6IDkwJTtcXG4gIGhlaWdodDogMTAwJTtcXG5cXG4gIG1hcmdpbjogMDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMTAlKTtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAxZnIpO1xcbn1cXG5cXG4jc2hpcHlhcmQge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4jc2hpcHlhcmQgaW1nIHtcXG4gIGhlaWdodDogMTB2aDtcXG4gIHdpZHRoOiAxMHZoO1xcbn1cXG4udGlsZSB7XFxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgY29sb3I6ICMxZTI5M2I7XFxufVxcblxcbi50aWxlID4gZGl2IHtcXG4gIGZvbnQtc2l6ZTogNnZoO1xcbn1cXG5cXG4jcDItZ2FtZWJvYXJkID4gLnRpbGU6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzY0NzQ4YjtcXG59XFxuXFxuI2VuZC1zY3JlZW4ge1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIHdpZHRoOiAxMDB2dztcXG5cXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDgwJSAyMCU7XFxufVxcbiN3aW5uaW5nLW1lc3NhZ2Uge1xcbiAgd2lkdGg6IDEwMCU7XFxuXFxuICBjb2xvcjogd2hpdGU7XFxuXFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFxuICBmb250LXNpemU6IDE1dmg7XFxufVxcblxcbiNwbGF5LWFnYWluIHtcXG4gIGZvbnQtc2l6ZTogNnZoO1xcbiAgd2lkdGg6IDI0JTtcXG5cXG4gIGJvcmRlci1yYWRpdXM6IDMwcHg7XFxufVxcblxcbiNwbGF5LWFnYWluOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM2NDc0OGI7XFxufVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsU0FBUztFQUNULFVBQVU7QUFDWjtBQUNBO0VBQ0UseUJBQXlCO0VBQ3pCLFlBQVk7RUFDWix5Q0FBeUM7QUFDM0M7QUFDQTtFQUNFLGtCQUFrQjtFQUNsQixjQUFjO0VBQ2QseUNBQXlDO0FBQzNDO0FBQ0E7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsV0FBVzs7RUFFWCxhQUFhO0VBQ2IsNEJBQTRCO0VBQzVCLG9CQUFvQjtBQUN0Qjs7QUFFQTtFQUNFLFdBQVc7RUFDWCxZQUFZOztFQUVaLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UseUJBQXlCOztFQUV6QixVQUFVO0VBQ1YsWUFBWTs7RUFFWixTQUFTO0VBQ1QsYUFBYTtFQUNiLHNDQUFzQztFQUN0QyxtQ0FBbUM7QUFDckM7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsNkJBQTZCO0VBQzdCLFlBQVk7QUFDZDs7QUFFQTtFQUNFLFlBQVk7RUFDWixXQUFXO0FBQ2I7QUFDQTtFQUNFLG1CQUFtQjtFQUNuQixjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsY0FBYztBQUNoQjs7QUFFQTtFQUNFLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixZQUFZOztFQUVaLGFBQWE7RUFDYiwyQkFBMkI7QUFDN0I7QUFDQTtFQUNFLFdBQVc7O0VBRVgsWUFBWTs7RUFFWixrQkFBa0I7O0VBRWxCLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsVUFBVTs7RUFFVixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0JcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKiB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG5ib2R5IHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMxZTI5M2I7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG59XFxuaGVhZGVyIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogM3ZoO1xcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxufVxcbmgxIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxubWFpbiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbn1cXG5cXG5zZWN0aW9uIHtcXG4gIGhlaWdodDogMTAwdmg7XFxuICB3aWR0aDogNTB2dztcXG5cXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDV2aCA5MHZoO1xcbiAgZ3JpZC1hdXRvLXJvd3M6IGF1dG87XFxufVxcblxcbi5nYW1lYm9hcmQtY29udGFpbmVyIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcblxcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLmdhbWVib2FyZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjFmNWY5O1xcblxcbiAgd2lkdGg6IDkwJTtcXG4gIGhlaWdodDogMTAwJTtcXG5cXG4gIG1hcmdpbjogMDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMTAlKTtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAxZnIpO1xcbn1cXG5cXG4jc2hpcHlhcmQge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4jc2hpcHlhcmQgaW1nIHtcXG4gIGhlaWdodDogMTB2aDtcXG4gIHdpZHRoOiAxMHZoO1xcbn1cXG4udGlsZSB7XFxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgY29sb3I6ICMxZTI5M2I7XFxufVxcblxcbi50aWxlID4gZGl2IHtcXG4gIGZvbnQtc2l6ZTogNnZoO1xcbn1cXG5cXG4jcDItZ2FtZWJvYXJkID4gLnRpbGU6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzY0NzQ4YjtcXG59XFxuXFxuI2VuZC1zY3JlZW4ge1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIHdpZHRoOiAxMDB2dztcXG5cXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDgwJSAyMCU7XFxufVxcbiN3aW5uaW5nLW1lc3NhZ2Uge1xcbiAgd2lkdGg6IDEwMCU7XFxuXFxuICBjb2xvcjogd2hpdGU7XFxuXFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFxuICBmb250LXNpemU6IDE1dmg7XFxufVxcblxcbiNwbGF5LWFnYWluIHtcXG4gIGZvbnQtc2l6ZTogNnZoO1xcbiAgd2lkdGg6IDI0JTtcXG5cXG4gIGJvcmRlci1yYWRpdXM6IDMwcHg7XFxufVxcblxcbiNwbGF5LWFnYWluOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM2NDc0OGI7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcblxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cblxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07IC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cblxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuXG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblxuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuXG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG5cbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBcIi8qIyBzb3VyY2VVUkw9XCIuY29uY2F0KGNzc01hcHBpbmcuc291cmNlUm9vdCB8fCBcIlwiKS5jb25jYXQoc291cmNlLCBcIiAqL1wiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuXG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuXG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcblxuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG5cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuXG4gIGNzcyArPSBvYmouY3NzO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgRG9tQ29udHJvbGxlciBmcm9tIFwiLi9tb2R1bGVzL0RvbUNvbnRyb2xsZXJcIjtcbmltcG9ydCBHYW1lIGZyb20gXCIuL21vZHVsZXMvR2FtZVwiO1xuaW1wb3J0IFwiLi9zdHlsZXMuY3NzXCI7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gIEdhbWUuc3RhcnQoKTtcbiAgRG9tQ29udHJvbGxlci5yZW5kZXJNYWluTGF5b3V0KCk7XG59O1xuIl0sIm5hbWVzIjpbIlBsYXllckZhY3RvcnkiLCJTaGlwRmFjdG9yeSIsIkFJRmFjdG9yeSIsImlkIiwicHJvdG90eXBlIiwicG9zc2libGVfbW92ZXMiLCJpIiwiaiIsInB1c2giLCJyYW5kb21BdHRhY2siLCJpbmRleCIsInJhbmRvbUluZGV4IiwidGVtcCIsInNwbGljZSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImxlbmd0aCIsInJhbmRvbVNoaXBQbGFjZW1lbnQiLCJnYW1lQm9hcmQiLCJwbGFjZVNoaXAiLCJPYmplY3QiLCJhc3NpZ24iLCJHYW1lIiwiRG9tQ29udHJvbGxlciIsInJlbmRlck1haW5MYXlvdXQiLCJtYWluIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYXBwZW5kIiwicmVuZGVyU2VjdGlvbiIsInBsYXllcjEiLCJwbGF5ZXIyIiwicGxheWVyIiwic2VjdGlvbiIsImNyZWF0ZUVsZW1lbnQiLCJoMSIsInRleHRDb250ZW50IiwiY29udGFpbmVyIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVuZGVyR2FtZUJvYXJkIiwicmVuZGVyU2hpcHlhcmQiLCJnYW1lYm9hcmQiLCJwbGF5ZXJCb2FyZCIsImdldEJvYXJkIiwiYm9hcmRfcm93cyIsImJvYXJkX2NvbHVtbnMiLCJib2FyZFRpbGUiLCJjb250ZW50IiwiaW5uZXJIVE1MIiwiYWRkRXZlbnRMaXN0ZW5lciIsIkRyYWdfYW5kX0Ryb3AiLCJhbGxvd0Ryb3AiLCJkcm9wIiwic2V0QXR0cmlidXRlIiwiYWN0aXZhdGVFbmVteUdhbWVib2FyZCIsInRpbGVzIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJ0aWxlIiwib25UaWxlQ2xpY2siLCJlIiwiZG9tX3RpbGUiLCJjdXJyZW50VGFyZ2V0IiwicDFfYXR0YWNrIiwicGFyc2VJbnQiLCJnZXRBdHRyaWJ1dGUiLCJjb25kaXRpb24iLCJwbGF5Um91bmQiLCJnYW1lX3RpbGUiLCJmaXJzdENoaWxkIiwidXBkYXRlQm9hcmQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY2xlYXJBbGxDaGlsZE5vZGVzIiwicmVuZGVyRW5kU2NyZWVuIiwiY29sdW1uIiwicm93Iiwic2hpcHlhcmQiLCJzaGlwSURzIiwic2hpcEltYWdlcyIsImRpdiIsInAiLCJpbWciLCJkcmFnZ2FibGUiLCJkcmFnIiwic3JjIiwiZW5kX3NjcmVlbiIsImRpc3BsYXlXaW5uZXIiLCJ3aW5uZXIiLCJyZW5kZXJQbGF5QWdhaW4iLCJidXR0b24iLCJzdGFydCIsIm5vZGUiLCJyZW1vdmVDaGlsZCIsImxhc3RDaGlsZCIsInByZXZlbnREZWZhdWx0IiwiZGF0YVRyYW5zZmVyIiwic2V0RGF0YSIsImRhdGEiLCJnZXREYXRhIiwic2hpcExlbmd0aCIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmUiLCJnZXRFbGVtZW50QnlJZCIsImhhc0NoaWxkTm9kZXMiLCJhdHRhY2siLCJhbGxTaGlwc1N1bmsiLCJHYW1lYm9hcmRGYWN0b3J5IiwiYm9hcmQiLCJBcnJheSIsImZpbGwiLCJtYXAiLCJfIiwicGxhY2VkU2hpcHMiLCJnZXRQbGFjZWRTaGlwcyIsInZhbGlkYXRlUGxhY2VtZW50Iiwic2hpcE9iamVjdCIsInh5X2Nvb3JkaW5hdGVzIiwiZGlyZWN0aW9uIiwiZ2V0TGVuZ3RoIiwic2hpcElEIiwiZ2V0SUQiLCJzaGlwIiwic3RhcnRfY29vcmRpbmF0ZXMiLCJ2YWxpZGF0ZUF0dGFjayIsImNvb3JkaW5hdGVzIiwicmVjZWl2ZUF0dGFjayIsInNoaXBQYXJ0Iiwic2hpcFBsYWNlbWVudERhdGEiLCJmaW5kIiwiaGl0SW5kZXgiLCJoaXQiLCJldmVyeSIsInBsYWNlZFNoaXAiLCJpc1N1bmsiLCJwbGF5ZXJfaWQiLCJvcHBvbmVudEJvYXJkIiwiRXJyb3IiLCJoaXRzIiwiZ2V0SGl0cyIsIndpbmRvdyIsIm9ubG9hZCJdLCJzb3VyY2VSb290IjoiIn0=