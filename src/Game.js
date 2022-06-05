export default class Game {
  constructor() {
    this.questions = [];
    this.score = 0;
    this.current = 0;
  }

  nextQuestion() {
    this.current += 1;
  }

  addScore() {
    this.score += 1;
  }

  addQuestion(question) {
    this.questions.push(question);
  }

  get currentQuestion() {
    return this.questions[this.current];
  }
}
