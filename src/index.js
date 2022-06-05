import Question from './Question';
import Game from './Game';

const mainContent = document.querySelector('.main-content');
let selectCategory;

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
      <select class="select-category">
        <option value="0">Random Category</option>
      </select>
      <button class="submit-category-btn">Select Category</button>
    </div>
  `;
  mainContent.insertAdjacentHTML('beforeend', selectionContainer);
  selectCategory = document.querySelector('.select-category');
  const selectBtn = document.querySelector('.submit-category-btn');
  selectBtn.addEventListener('click', startGame);
}

async function getQuestions(game) {
  const category = parseInt(selectCategory.value);
  let url = 'https://opentdb.com/api.php?amount=10';
  url += category > 0 ? `&category=${category}` : '';
  const response = await fetch(url);
  const data = await response.json();
  data.results.forEach(questionData => {
    const question = new Question(
      questionData.question,
      questionData.correct_answer,
      questionData.incorrect_answers
    );
    game.addQuestion(question);
  });
}

async function startGame() {
  const game = new Game();
  await getQuestions(game);
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
    }, 3000);
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
      }
    });
  });

  const answerDiv = document.querySelector('.answers');
  game.currentQuestion.allAnswers.forEach((answer, idx) => {
    const answerInput = `
      <input id="answer${idx}" name="answer" type="radio" value=${answer}
      <label for="answer${idx}">${answer}</label>
      `;
    answerDiv.insertAdjacentHTML('beforeend', answerInput);
  });
}

async function getCategories() {
  const response = await fetch('https://opentdb.com/api_category.php');
  const data = await response.json();
  data.trivia_categories.forEach(category => {
    const option = `<option value=${category.id}>${category.name}</option>`;
    selectCategory.insertAdjacentHTML('beforeend', option);
  });
}
