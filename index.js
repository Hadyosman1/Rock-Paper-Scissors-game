"use strict";

// game settinges
const OriginalgameActions = [
  { name: "rock", img: "icon-rock.svg" },
  { name: "paper", img: "icon-paper.svg" },
  { name: "scissors", img: "icon-scissors.svg" },
];
let score = localStorage.getItem("game-score") || 0;

// DOM elements
const modal = document.querySelector(".moadal-wrapper");
const closeRulesModalBtn = document.getElementById("close-rules-modal-btn");
const rulesBtn = document.getElementById("rules-btn");
const modalContent = document.getElementById("modal-content");
const scoreCounter = document.getElementById("score-counter");
const gameWrapper = document.querySelector(".game");

// Set Score
scoreCounter.innerText = score;

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

// Display Game Actions
function displayGameActions(actions) {
  const gameActionsWrapper = document.querySelector(".game-actions");
  const fragment = document.createDocumentFragment();

  actions.forEach((act) => {
    const span = document.createElement("span");
    span.textContent = act.name;
    fragment.appendChild(span);
  });

  gameActionsWrapper.append(fragment);
}
displayGameActions(OriginalgameActions);

// Display Game Actions Buttons
function displayGameActionsButtons(actions) {
  gameWrapper.innerHTML = `<div class="game-options"></div>`;

  const gameOptionsWrapper = document.querySelector(".game-options");
  let buttons = ``;

  actions.forEach((act) => {
    buttons += ` 
      <button data-option="${act.name}" class="option game-option">
        <img src="./images/${act.img}" alt="icon ${act.name}" />
      </button>
    `;
  });
  gameOptionsWrapper.innerHTML = buttons;
  addEventListnerToActionButtons();
}
displayGameActionsButtons(OriginalgameActions);

// Handle Game Option Clicked
function handleGameOptionClicked(ele) {
  const selectedOption = ele.dataset.option;
  ele = ele.cloneNode(true);
  ele.classList.add("selelcted", "user-choice");

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
  setTimeout(() => displayComputerChoice(selectedOption), 2500);
}

function displayComputerChoice(userChioce) {
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
  const gameResult = compareChoices(userChioce, computerChoice.name);
  handleWinner(gameResult);
}

function addEventListnerToActionButtons() {
  document.querySelectorAll(".game-option").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      handleGameOptionClicked(e.target);
    });
  });
}

// Handle Computer Choice
function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * OriginalgameActions.length);
  return OriginalgameActions[randomIndex];
}

// Handle who Is Winner
function compareChoices(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    // No One Win
    return false;
  }

  if (userChoice === "rock" && computerChoice === "paper") {
    return "computer";
  }

  if (userChoice === "paper" && computerChoice === "rock") {
    return "user";
  }

  if (userChoice === "paper" && computerChoice === "scissors") {
    return "computer";
  }

  if (userChoice === "scissors" && computerChoice === "paper") {
    return "user";
  }

  if (userChoice === "rock" && computerChoice === "scissors") {
    return "user";
  }

  if (userChoice === "scissors" && computerChoice === "rock") {
    return "computer";
  }
}

function incrementScore() {
  score++;
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
    // Add Winner Shape To Winner
    document.querySelector(".user-choice").classList.add("winner-shape");
    resultContentElement.textContent = "You Win";
    incrementScore();
  } else {
    // Add Winner Shape To Winner
    document.querySelector(".computer-choice").classList.add("winner-shape");
    resultContentElement.textContent = "You Lost!";
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
  }, 500);
}

function HandlePlayAgain(resultWrapper) {
  resultWrapper.remove();

  // Reset Ui To Choose Action
  displayGameActionsButtons(OriginalgameActions);
}
