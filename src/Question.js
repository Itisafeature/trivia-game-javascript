export default class Question {
  constructor(content, correctAnswer, incorrectAnswers) {
    this.content = content;
    this.correctAnswer = correctAnswer;
    this.incorrectAnswers = incorrectAnswers;
  }

  static async getQuestions(game, category) {
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
