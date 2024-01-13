import * as questionsService from "../../services/questionService.js";

const showMain = async({ render }) => {
  const questions = await questionsService.getQuestionCount();
  const answers = await questionsService.getAnswerCount();
  render("main.eta", {questions: questions.count, answers: answers.count});
};

export { showMain };