const view = {
  displayMessage: (msg) => {
    let messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },

  displayHit: (location) => {
    let td = document.getElementById(location);
    td.setAttribute("class", "hit");
  },

  displayMiss: (location) => {
    let td = document.getElementById(location);
    td.setAttribute("class", "miss");
  },
};

const model = {
  boardSize: 7,
  numShips: 3,
  shipLenght: 3,
  shipsSunk: 0,

  ships: [
    { locations: ["06", "16", "26"], hits: ["", "", ""] },
    { locations: ["24", "34", "44"], hits: ["", "", ""] },
    { locations: ["10", "11", "22"], hits: ["", "", ""] },
  ],

  fire: (guess) => {
    for (let i = 0; i < model.numShips; i++) {
      let ship = model.ships[i];
      let location = ship.locations;
      let index = location.indexOf(guess);

      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");

        if (model.isSunk(ship)) {
          view.displayMessage("You sank the battleship!");
          model.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("MISS!");
    return false;
  },

  isSunk: (ship) => {
    for (let i = 0; i < model.shipLenght; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
};

const controller = {
  guesses: 0,

  parseGuess: (guess) => {
    const alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
      alert("Please enter a valid guess");
    } else {
      let row = alphabet.indexOf(guess[0]);
      let column = guess[1];

      if (isNaN(row) || isNaN(column)) {
        alert("Wrong cell!");
      } else if (
        row < 0 ||
        row >= model.boardSize ||
        column < 0 ||
        column >= model.boardSize
      ) {
        alert("Wrong cell!");
      } else {
        return `${row}${column}`;
      }
    }
    return null;
  },

  processGuess: (guess) => {
    let location = controller.parseGuess(guess);
    if (location) {
      controller.guesses++;
      let hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(
          `You have sank all the battleships, in ${controller.guesses} guesses`
        );
      }
    }
  },
};

controller.processGuess("A6");
