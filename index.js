"use strict";

// game settings
let gameActions = [];
const originalGameActions = [
  { name: "rock", img: "icon-rock.svg" },
  { name: "paper", img: "icon-paper.svg" },
  { name: "scissors", img: "icon-scissors.svg" },
];

const additionGameActions = [
  { name: "lizard", img: "icon-lizard.svg" },
  { name: "spock", img: "icon-spock.svg" },
];

const rules = {
  regular: "./images/image-rules.svg",
  advanced: "./images/image-rules-bonus.svg",
};

let score = localStorage.getItem("game-score") || 0;

// DOM elements
const modal = document.querySelector(".modal-wrapper");
const closeRulesModalBtn = document.getElementById("close-rules-modal-btn");
const rulesBtn = document.getElementById("rules-btn");
const rulesImg = document.getElementById("rules-img");
const modalContent = document.getElementById("modal-content");
const scoreCounter = document.getElementById("score-counter");
const gameWrapper = document.querySelector(".game");
const switchGameBehaviorBtn = document.querySelector(
  ".switch-game-behavior-btn"
);

// Set Score
scoreCounter.innerText = score;

// Set game actions
gameActions = originalGameActions;

function handleSwitchGameBehavior() {
  if (gameActions.length === 3) {
    gameActions = [...originalGameActions, ...additionGameActions];
    switchGameBehaviorBtn.innerText = "Switch to regular";
    rulesImg.src = rules.advanced;
    gameInitializer();
  } else {
    gameActions = originalGameActions;
    switchGameBehaviorBtn.innerText = "Switch to advanced";
    rulesImg.src = rules.regular;
    gameInitializer();
  }
}

switchGameBehaviorBtn.addEventListener("click", handleSwitchGameBehavior);

//stopPropagation fn
function stopPropagation(e) {
  e.stopPropagation();
}

// Handle Rules Modal
function closeModal() {
  modal.classList.remove("show-modal");
}

function showModal() {
  modal.classList.add("show-modal");
}

rulesBtn.addEventListener("click", showModal);

modalContent.addEventListener("click", stopPropagation);

closeRulesModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", closeModal);

function gameInitializer() {
  displayGameActions();
  displayGameActionsButtons();
}
gameInitializer();

// Display Game Actions
function displayGameActions() {
  const gameActionsWrapper = document.querySelector(".game-actions");
  const fragment = document.createDocumentFragment();

  gameActionsWrapper.innerHTML = ``;

  gameActions.forEach((act) => {
    const span = document.createElement("span");
    span.textContent = act.name;
    fragment.appendChild(span);
  });

  gameActionsWrapper.append(fragment);
}

// Display Game Actions Buttons
function displayGameActionsButtons() {
  gameWrapper.innerHTML = `<div class="game-options ${
    gameActions.length !== 3 && "advanced"
  }"></div>`;

  const gameOptionsWrapper = document.querySelector(".game-options");
  gameOptionsWrapper.style.backgroundImage =
    gameActions.length === 3
      ? "url(./images/bg-triangle.svg)"
      : "url(./images/bg-pentagon.svg)";

  let buttons = ``;

  gameActions.forEach((act) => {
    buttons += ` 
      <button data-option="${act.name}" class="option game-option">
        <img src="./images/${act.img}" alt="icon ${act.name}" />
      </button>
    `;
  });
  gameOptionsWrapper.innerHTML = buttons;
  addEventListenerToActionButtons();
}

// Handle Game Option Clicked
function handleGameOptionClicked(ele) {
  const selectedOption = ele.dataset.option;
  ele = ele.cloneNode(true);
  ele.classList.add("selected", "user-choice");

  // Reset Ui
  gameWrapper.innerHTML = `
    <div class="picked-details"></div>
    <div class="selected-step">
      <button class="computer-choice-place-holder"></button>
    </div>
  `;

  // Append Selected Option From User
  gameWrapper.querySelector(".selected-step").prepend(ele);
  gameWrapper.querySelector(".picked-details").innerHTML += `
  <h2 class="picked-text">You Picked</h2>
  <h3 class="picked-text">The House Picked</h3>
  `;

  // Display Computer Choice After 3 Secondes
  setTimeout(() => displayComputerChoice(selectedOption), 1000);
}

function displayComputerChoice(userChoice) {
  // Remove Place Holder
  document.querySelector(".computer-choice-place-holder").remove();

  const computerChoice = getComputerChoice();

  const computerChoiceElement = document.createElement("button");
  computerChoiceElement.style.position = `static`;
  computerChoiceElement.style.transform = `translate(-15px , 0)`;
  computerChoiceElement.classList.add("option", "selected", "computer-choice");
  computerChoiceElement.setAttribute("data-option", computerChoice.name);

  const computerChoiceImg = document.createElement("img");
  computerChoiceImg.src = `./images/${computerChoice.img}`;
  computerChoiceImg.alt = `icon ${computerChoice.name}`;

  computerChoiceElement.append(computerChoiceImg);
  gameWrapper.querySelector(".selected-step").append(computerChoiceElement);

  // Handle Who Is Winner
  const gameResult = compareChoices(userChoice, computerChoice.name);
  handleWinner(gameResult);
}

function addEventListenerToActionButtons() {
  document.querySelectorAll(".game-option").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      handleGameOptionClicked(e.target);
    });
  });
}

// Handle Computer Choice
function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * gameActions.length);
  return gameActions[randomIndex];
}

// Handle who Is Winner
function compareChoices(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    // No One Win
    return false;
  }

  if (userChoice === "rock") {
    switch (computerChoice) {
      case "scissors":
      case "wizard":
        return "user";
      default:
        return "computer";
    }
  }

  if (userChoice === "paper") {
    switch (computerChoice) {
      case "rock":
      case "spock":
        return "user";
      default:
        return "computer";
    }
  }

  if (userChoice === "scissors") {
    switch (computerChoice) {
      case "paper":
      case "lizard":
        return "user";
      default:
        return "computer";
    }
  }

  if (userChoice === "lizard") {
    switch (computerChoice) {
      case "spock":
      case "paper":
        return "user";
      default:
        return "computer";
    }
  }

  if (userChoice === "spock") {
    switch (computerChoice) {
      case "scissors":
      case "rock":
        return "user";
      default:
        return "computer";
    }
  }
}

function incrementScore() {
  score++;
  localStorage.setItem("game-score", score);
  scoreCounter.innerText = score;
}

function decrementScore() {
  if (score === 0) return;
  score--;
  localStorage.setItem("game-score", score);
  scoreCounter.innerText = score;
}

function handleWinner(winner) {
  const resultWrapper = document.createElement("div");
  resultWrapper.classList.add("who-is-winner-wrapper");

  // Append Result Wrapper
  document.body.prepend(resultWrapper);

  const resultElement = document.createElement("div");
  resultElement.classList.add("who-is-winner-content");

  const resultContentElement = document.createElement("p");

  if (!winner) {
    resultContentElement.textContent = "no one win!";
  } else if (winner === "user") {
    document.querySelector(".user-choice").classList.add("winner-shape");
    resultContentElement.textContent = "You Win";
    incrementScore();
  } else {
    document.querySelector(".computer-choice").classList.add("winner-shape");
    resultContentElement.textContent = "You Lost!";
    decrementScore();
  }

  const playAgainBtn = document.createElement("button");
  playAgainBtn.textContent = "Play Again";

  playAgainBtn.addEventListener("click", () => HandlePlayAgain(resultWrapper));

  // Append Content
  resultElement.append(resultContentElement);
  resultElement.append(playAgainBtn);
  resultWrapper.append(resultElement);

  // Show Result Wrapper
  setTimeout(() => {
    resultWrapper.classList.add("show-who-is-winner-wrapper");
  }, 250);
}

function HandlePlayAgain(resultWrapper) {
  resultWrapper.remove();

  // Reset Ui To Choose Action
  displayGameActionsButtons();
}
