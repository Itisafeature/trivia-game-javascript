export default class Question {
  constructor(content, correctAnswer, incorrectAnswers) {
    this.content = content;
    this.correctAnswer = correctAnswer;
    this.incorrectAnswers = incorrectAnswers;
  }

  get allAnswers() {
    const allAnswersArr = [this.correctAnswer, ...this.incorrectAnswers];
    for (let i = allAnswersArr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [allAnswersArr[i], allAnswersArr[j]] = [
        allAnswersArr[j],
        allAnswersArr[i],
      ];
    }
    return allAnswersArr;
  }
}

Question.all = [];
