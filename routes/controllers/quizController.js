import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";
import * as quizService from "../../services/quizService.js";

const showQuiz = async({render}) => {
  const topics = await topicService.getTopics();
  render("quiz.eta", { topics: topics });
};

const showTopic = async({response, params, render}) => {
  const id = params.tId;
  const questions = await questionService.getQuestionsByTopic(id);
  const amt = questions.length

  if (amt === 0) {
    render("quizQuestion.eta"); 
    return;
  };

  const index = Math.floor(Math.random() * amt);
  const qId = questions[index].id;

  response.redirect(`/quiz/${id}/questions/${qId}`);
};

const showQuestion = async ({render, params}) => {
  const question = await questionService.getQuestionById(params.qId);
  const options = await optionService.getOptionsForId(params.qId);

  render("quizQuestion.eta", {question: question, options: options});
};

const submitOption = async({render, params, user}) => {
  const qId = params.qId;
  const oId = params.oId;
  const uId = user.id;

  await quizService.saveAnswer(uId, qId, oId);
  const chosen = await optionService.getOptionById(oId);
  const correct = await optionService.getCorrectByQid(qId);
  
  render("answer.eta", {chosen: chosen, correct: correct, tId: params.tId});
};

export { showQuiz, showTopic, showQuestion, submitOption };