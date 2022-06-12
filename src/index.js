import Question from './Question';
import Game from './Game';
import Category from './Category';

const mainContent = document.querySelector('.main-content');

document.addEventListener('DOMContentLoaded', () => {
  init();
});

async function init() {
  if (Category.allCategories.length === 0) {
    await Category.getCategories();
  }
  addSelectionContainer();
  displayCategoryOptions();
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
  const questionAmount =
    parseInt(document.querySelector('#num-questions-input').value) || 10;
  await Question.getQuestions(game, category, questionAmount);
  mainContent.innerHTML = '';
  displayQuestion(game);
}

function checkAnswer(game) {
  const answer = document.querySelector('input[name="answer"]:checked').value;
  let display;
  if (answer === game.currentQuestion.correctAnswer) {
    game.addScore();
    display = '<h3 class="correct-answer">You got it right!</h3>';
  } else {
    display = '<h3 class="incorrect-answer">You got it wrong!</h3>';
  }

  document
    .querySelector('.question-answers-container')
    .insertAdjacentHTML('afterbegin', display);

  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      mainContent.lastChild.remove();
      resolve();
    }, 2000);
  });
}

function displayQuestion(game) {
  const displayedQuestion = `
    <div class="question-answers-container">
      <p class="question-content">${game.currentQuestion.content}
      <div class="answers"></div>
      <button class="submit-answer-btn">Submit Answer</button>
    </div>
  `;
  mainContent.innerHTML = displayedQuestion;

  document
    .querySelector('.submit-answer-btn')
    .addEventListener('click', function () {
      this.disabled = true;
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
      <div class="answer">
        <input id="answer${idx}" name="answer" type="radio" value="${answer}" />
        <label class="answer-label" for="answer${idx}">${answer}</label>
      </div>
      `;
    answerDiv.insertAdjacentHTML('beforeend', answerInput);
  });
}

function endGame(game) {
  mainContent.innerHTML = '';
  const endGameHTML = `
    <div class="endgame-content">
      <h1>Game Over. Your score ${game.score} / ${game.questions.length}<h1>
    </div>
  `;
  mainContent.insertAdjacentHTML('beforeend', endGameHTML);
  init();
}

function displayCategoryOptions() {
  const selectCategory = document.querySelector('.select-category');
  Category.allCategories.forEach(category => {
    const option = `<option value=${category.id}>${category.name}</option>`;
    selectCategory.insertAdjacentHTML('beforeend', option);
  });
}
