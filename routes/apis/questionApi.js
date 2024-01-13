import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";

const getRandom = async({response}) => {
  const question = await questionService.getRandomQuestion();

  if (!question) {
    response.body = {}; 
    return;
  }

  const answerOptions = await optionService.getOptionsForIdApi(question.id);

  const mappedOptions = answerOptions.map((x) => ({ "optionId": x.id, "optionText": x.option_text }))

  response.body = {
    "questionId": question.id,
    "questionText": question.question_text,
    "answerOptions": mappedOptions,
  };
};

const postAnswer = async({request, response}) => {
  const body = request.body({type: "json"});
  const document = await body.value;

  const answer = await questionService.checkCorrectAnswer(document.optionId, document.questionId);

  response.body = { correct: answer };
};

export { getRandom, postAnswer };