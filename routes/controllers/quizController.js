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

const submitOption = async({response, params, user}) => {
  const qId = params.qId;
  const oId = params.oId;
  const uId = user.id;

  await quizService.saveAnswer(uId, qId, oId);
  const chosen = await optionService.getOptionById(oId);
  
  if (chosen.is_correct) {
    response.redirect(`/quiz/${params.tId}/questions/${qId}/correct`)
  } else {
    response.redirect(`/quiz/${params.tId}/questions/${qId}/incorrect`)
  }
};

const showAnswer = async({render, request, params}) => {
if (request.url.pathname.endsWith('/correct')) {
    console.log(params);
    render('correct.eta', { tId: params.tId });
  } else if (request.url.pathname.endsWith('/incorrect')) {
    const data = {
      tId: params.tId,
      correctOptions: await optionService.getCorrectByQid(params.qId)
    };
    console.log(data);
    render('incorrect.eta', data);
  }
};

export { showQuiz, showTopic, showQuestion, submitOption, showAnswer };