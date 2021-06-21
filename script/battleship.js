window.onload = () => {
  let fireButton = document.getElementById("fireButton");
  let guessInput = document.getElementById("guessInput");

  fireButton.onclick = () => {
    controller.processGuess(guessInput.value);
    guessInput.value = "";
  };

  guessInput.onkeypress = (e) => {
    if (e.key === "Enter") {
      fireButton.click();
      return false;
    }
  };

  model.generateShipLocations();
};

const view = {
  displayMessage: function (msg) {
    let messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },

  displayHit: function (location) {
    let td = document.getElementById(location);
    td.setAttribute("class", "hit");
  },

  displayMiss: function (location) {
    let td = document.getElementById(location);
    td.setAttribute("class", "miss");
  },
};

const model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
  ],

  generateShipLocations: function () {
    let locations;
    for (let i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },

  generateShip: function () {
    let direction = Math.floor(Math.random() * 2);
    let row, col;

    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
      col = Math.floor(Math.random() * this.boardSize);
    }

    let newShipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push(row + i + "" + col);
      }
    }

    return newShipLocations;
  },

  collision: function (locations) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      for (let j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },

  fire: function (guess) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      let location = ship.locations;
      let index = location.indexOf(guess);

      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");

        if (this.isSunk(ship)) {
          view.displayMessage("You sank the battleship!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("MISS!");
    return false;
  },

  isSunk: function (ship) {
    for (let i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
};

const controller = {
  guesses: 0,

  parseGuess: function (guess) {
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

  processGuess: function (guess) {
    let location = this.parseGuess(guess);
    if (location) {
      this.guesses++;
      let hit = model.fire(location);
      console.log(model.numShips);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(
          `You have sank all the battleships, in ${this.guesses} guesses`
        );
      }
    }
  },
};
