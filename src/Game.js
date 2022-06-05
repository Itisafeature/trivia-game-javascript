export default class Game {
  constructor(questions) {
    this.questions = questions;
    this.score = 0;
    this.current = 0;
  }

  get currentQuestion() {
    return this.questions[this.current];
  }
}
