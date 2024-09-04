// Define HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const score = document.getElementById("score");

// Get the count of Rows
const gameBoardHeight = board.clientHeight; // Get the game-board Height
const rowHeight = 20; // Set the Height of row (20px)

// Define game variables
const gridColumns = 4;
let gridRows = Math.floor(gameBoardHeight / rowHeight);
let player = {x: 3, y: gridRows};
let computers = [];
let gameSpeedDelay = 150;
let gameStarted = false;
let gameInterval;

// Draw game map, player, computers
function draw() {
  board.innerHTML = "";
  drawPlayer();
  drawComputers();
}

// Draw player
function drawPlayer() {
  const playerElement = createGameElement("div", "player");
  setPosition(playerElement, player);
  board.appendChild(playerElement);
}

// Create player or computer div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of player or computers
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw computers
function drawComputers() {
  if(computers.length) {
    // move all the computers down
    computers.forEach( computer => computer.y++ );
    checkCollision();
    if(!gameStarted) {
      computers.forEach( computer => {
        computer.y --;
        const computerElement = createGameElement("div", "computer");
        setPosition(computerElement, computer);
        board.appendChild(computerElement);
      } );
    }

    // if computer out of the bottom, del it.
    if(computers[0].y > gridRows) {
      computers.shift();
      updateScore();
    }

    // 50% chance to add new computer
    if(Math.floor(Math.random() * 2)) {
      computers.push(generateComputer());
    }

  } else {
    // if no computer, then only add a new computer
    computers.push(generateComputer());
  }

  if(gameStarted) {
    computers.forEach( computer => {
      const computerElement = createGameElement("div", "computer");
      setPosition(computerElement, computer);
      board.appendChild(computerElement);
    } );
  }
}

function generateComputer() {
  const x = Math.floor(Math.random() * gridColumns) + 1;
  return {x, y: 1};
}

// Moving the player
function handleKeyPress(event) {
  if((!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")) {
    startGame();
  } else {
    switch(event.key) {
      case "ArrowLeft":
        if(player.x > 1) --player.x;
        break;
      case "ArrowRight":
        if(player.x < gridColumns) ++player.x;
        break;
    }
    checkCollision();
  }
}

document.addEventListener("keydown", handleKeyPress);

// start the Game
function startGame() {
  gameStarted = true;
  player = {x: 3, y: gridRows};
  computers = [];
  score.textContent = "0000";
  instructionText.style.display = "none";
  gameInterval = setInterval( () => {
    draw();
  }, gameSpeedDelay )
}

function checkCollision() {
  for(let computer of computers) {
    if(computer.y >= gridRows) {
      if(computer.x === player.x && computer.y === player.y) {
        resetGame();
      }
    } else {
      break;
    }
  }
}

function resetGame() {
  stopGame();
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.innerHTML = "Game Over!</br>Press spacebar to start the game";
  instructionText.style.display = "block";
}

function updateScore() {
  const newScore = +score.textContent + 1;
  score.textContent = newScore.toString().padStart(4, "0");
}

//drawComputers();


/**
setInterval( () => {
  draw();
}, gameSpeedDelay );
 **/
