import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";
import * as topicService from "../../services/topicService.js";
import { validasaur } from "../../deps.js";

const optionRules = {
  option_text: [validasaur.required, validasaur.minLength(1)],
};

const getOptionData = async(request) => {
  const body = request.body({type: "form"});
  const params = await body.value;

  return {
    option_text: params.get("option_text"),
    is_correct: (params.get("is_correct") === "") ? true : false,
  };
};

const addOption = async({params, request, response, render}) => {
  const optionData = await getOptionData(request);
  const [passes, errors] = await validasaur.validate(
    optionData,
    optionRules,
  );

  if (!passes) {
    console.log(errors);
    optionData.errors = errors;
    optionData.question = await questionService.getQuestionById(params.qId);
    optionData.options = await optionService.getOptionsForId(params.qId);
    optionData.topic = await topicService.getTopicById(params.id);
    render("question.eta", optionData);
  } else {
    await optionService.addOptionForId(
      params.qId,
      optionData.option_text,
      optionData.is_correct,
    );
    response.redirect(`/topics/${params.id}/questions/${params.qId}`);
  }
};

const deleteOption = async({response, params}) => {
  await optionService.deleteOption(params.oId);

  response.redirect(`/topics/${params.tId}/questions/${params.qId}`)
}; 

export { addOption, deleteOption }