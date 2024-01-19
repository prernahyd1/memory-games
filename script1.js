const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const movesInput = document.getElementById("moves-input");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items array
const items = [
  { name: "bee", image: "bee.png" },
  { name: "crocodile", image: "crocodile.png" },
  { name: "macaw", image: "macaw.png" },
  { name: "gorilla", image: "gorilla.png" },
  { name: "tiger", image: "tiger.png" },
  { name: "monkey", image: "monkey.png" },
  { name: "chameleon", image: "chameleon.png" },
  { name: "piranha", image: "piranha.png" },
  { name: "anaconda", image: "anaconda.png" },
  { name: "sloth", image: "sloth.png" },
  { name: "cockatoo", image: "cockatoo.png" },
  { name: "toucan", image: "toucan.png" },
];

//Initial Time
let seconds = 0,
  minutes = 0;
//Initial moves and win count
let movesCount = 0,
  winCount = 0;
// Maximum moves and time
let maxMoves = 0;
const maxTime = 180; // in seconds

//For timer
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;

  // Check if time limit reached
  if (minutes >= maxTime / 60 && seconds >= maxTime % 60) {
    stopGame();
    result.innerHTML = `<h2>Time's up!</h2><h4>Moves: ${movesCount}</h4>`;
  }
};

//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;

  // Check if move limit reached
  if (movesCount >= maxMoves) {
    stopGame();
    result.innerHTML = `<h2>you lost!</h2><h4>Moves: ${movesCount}</h4>`;
  }
};

// Restarts the game
const restartGame = () => {
  clearInterval(interval);
  initializer();
};

// Pick random objects from the items array
const generateRandom = (size = 4) => {
  // temporary array
  let tempArray = [...items];
  // initializes cardValues array
  let cardValues = [];
  // size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (size * size) / 2;
  // Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    // once selected, remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  // simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
      Create Cards
      before => front side (contains question mark)
      after => back side (contains actual image);
      data-card-values is a custom attribute which stores the names of the cards to match later
    */
    gameContainer.innerHTML += `
       <div class="card-container" data-card-value="${cardValues[i].name}">
          <div class="card-before">?</div>
          <div class="card-after">
            <img src="${cardValues[i].image}" class="image"/>
          </div>
       </div>
     `;
  }
  // Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  // Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // If selected card is not matched yet, then only run (i.e., already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        // Flip the clicked card
        card.classList.add("flipped");
        // If it is the first card (!firstCard since firstCard is initially false)
        if (!firstCard) {
          // So the current card will become the firstCard
          firstCard = card;
          // The current card's value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          // Increment moves since the user selected the second card
          movesCounter();
          // secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            // If both cards match, add matched class so these cards would be ignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            // Set firstCard to false since the next card would be the first now
            firstCard = false;
            // winCount increment as the user found a correct match
            winCount += 1;
            // Check if winCount == half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won!</h2><h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            // If the cards don't match
            // Flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

// Start game
//startButton.addEventListener("click", () => {
 // movesCount = 0;
 // seconds = 0;
  //minutes = 0;
  // Controls and buttons visibility
  //controls.classList.add("hide");
  //stopButton.classList.remove("hide");
  //startButton.classList.add("hide");
  // Start timer
  //interval = setInterval(timeGenerator, 1000);
  // Initial moves
  //moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  //initializer();
//});
startButton.addEventListener("click", () => {
  const desiredMoves = parseInt(movesInput.value);
  if (isNaN(desiredMoves) || desiredMoves < 1) {
    alert("Please enter a valid number of moves.");
    return;
  }
  maxMoves = desiredMoves;
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  // Controls and buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  // Start timer
  interval = setInterval(timeGenerator, 1000);
  // Initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});
movesInput.addEventListener("input", () => {
  const desiredMoves = parseInt(movesInput.value);
  if (isNaN(desiredMoves) || desiredMoves < 8) {
    startButton.disabled = true;
  } else {
    startButton.disabled =false;
}
});

// Stop game
stopButton.addEventListener("click", () => {
  stopGame();
});

// Stop the game and show the result
const stopGame = () => {
  clearInterval(interval);
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
};

// Initialize values and function calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};

// Restart game
restartButton.addEventListener("click", () => {
  restartGame();
});