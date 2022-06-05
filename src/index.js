import Question from './Question';
import Game from './Game';

const mainContent = document.querySelector('.main-content');

document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {
  addSelectionContainer();
  getCategories();
}

function addSelectionContainer() {
  const selectionContainer = `
    <div class="selection-container">
      <label for="select-category">Select a Category</label>
      <select id="select-category" class="select-category">
        <option value="0">Random Category</option>
      </select>
      <label for="num-questions-input">Number of Questions</label>
      <input id="num-questions-input" type="number" name="amount" min=1 />
      <button class="submit-category-btn">Select Category</button>
    </div>
  `;
  mainContent.insertAdjacentHTML('beforeend', selectionContainer);
  const selectBtn = document.querySelector('.submit-category-btn');
  selectBtn.addEventListener('click', startGame);
}

async function startGame() {
  const game = new Game();
  const category = parseInt(document.querySelector('.select-category').value);
  const questionAmount = parseInt(
    document.querySelector('#num-questions-input').value
  );
  await Question.getQuestions(game, category, questionAmount);
  mainContent.innerHTML = '';
  displayQuestion(game);
}

function checkAnswer(game) {
  const answer = document.querySelector('input[name="answer"]:checked').value;
  let display;
  if (answer === game.currentQuestion.correctAnswer) {
    game.addScore();
    display = '<p>You got it right!</p>';
  } else {
    display = '<p>You got it wrong!</p>';
  }
  mainContent.insertAdjacentHTML('beforeend', display);
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      mainContent.lastChild.remove();
      resolve();
    }, 500);
  });
}

function displayQuestion(game) {
  const displayedQuestion = `
    <p>${game.currentQuestion.content}
    <div class="answers">
    </div>
    <button class="submit-answer-btn">Submit</button>
  `;
  mainContent.innerHTML = displayedQuestion;

  document.querySelector('.submit-answer-btn').addEventListener('click', () => {
    checkAnswer(game).then(() => {
      game.nextQuestion();
      if (game.current <= game.questions.length - 1) {
        displayQuestion(game);
      } else {
        endGame(game);
      }
    });
  });

  const answerDiv = document.querySelector('.answers');
  game.currentQuestion.allAnswers.forEach((answer, idx) => {
    const answerInput = `
      <input id="answer${idx}" name="answer" type="radio" value="${answer}"
      <label for="answer${idx}">${answer}</label>
      `;
    answerDiv.insertAdjacentHTML('beforeend', answerInput);
  });
}

function endGame(game) {
  mainContent.innerHTML = '';
  const endGameHTML = `
    <div>
      <h1>Game Over. Your score ${game.score} / ${game.questions.length}<h1>
    </div>
  `;
  mainContent.insertAdjacentHTML('beforeend', endGameHTML);
  init();
}

async function getCategories() {
  const response = await fetch('https://opentdb.com/api_category.php');
  const data = await response.json();
  const selectCategory = document.querySelector('.select-category');
  data.trivia_categories.forEach(category => {
    const option = `<option value=${category.id}>${category.name}</option>`;
    selectCategory.insertAdjacentHTML('beforeend', option);
  });
}
