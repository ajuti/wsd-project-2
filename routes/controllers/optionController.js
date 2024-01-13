import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";
import * as topicService from "../../services/topicService.js";
import { validasaur } from "../../deps.js";

const optionRules = {
  option_text: [validasaur.required, validasaur.minLength(1)],
};
const getOptionData = async (request, pathParams ) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  return {
    topic: await topicService.getTopicById(pathParams.tId),
    question: await questionService.getQuestionById(pathParams.qId),
    answerOptions: await optionService.getOptionsForId(pathParams.qId),

    option_text: params.get("option_text"),
    is_correct: params.has("is_correct"),
  }; 
};

const addOption = async ({ response, request, params, render }) => {
  const optionData = await getOptionData(request, params);
  
  const [passes, errors] = await validasaur.validate(optionData, optionRules);

  if (passes) {
    await optionService.addOptionForId(params.qId, optionData.option_text, optionData.is_correct);
    response.redirect(`/topics/${ params.tId }/questions/${ params.qId }`);
  } else {
    optionData.errors = errors;
    render("question.eta", optionData);
  }
};
const deleteOption = async({response, params}) => {
  await optionService.deleteOption(params.oId);

  response.redirect(`/topics/${params.tId}/questions/${params.qId}`)
}; 

export { addOption, deleteOption }