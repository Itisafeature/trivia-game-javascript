import Question from './Question';
import Game from './Game';

const mainContent = document.querySelector('.main-content');
let selectCategory;
let game;

document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {
  addSelectionContainer();
  getCategories();
  game = new Game([]);
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
  selectBtn.addEventListener('click', getQuestions);
}

async function getQuestions() {
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
    game.questions.push(question);
    startGame();
  });
}

function startGame() {
  mainContent.innerHTML = '';
  displayQuestion();
}

function displayQuestion() {
  const displayedQuestion = `
    <p>${game.currentQuestion.content}
    <div class="answers">
    </div>
  `;
  mainContent.innerHTML = displayedQuestion;
  const answerDiv = document.querySelector('.answers');
  game.currentQuestion.allAnswers.forEach((answer, idx) => {
    const answerInput = `
      <input id="answer${idx}" type="radio" value=${answer}
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
