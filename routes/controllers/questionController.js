import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";
import * as topicService from "../../services/topicService.js";
import { validasaur } from "../../deps.js";

const questionRules = {
  question_text: [validasaur.required, validasaur.minLength(1)],
};

const getQuestionData = async(request) => {
  const body = request.body({type: "form"});
  const params = await body.value;

  return {
    question_text: params.get("question_text"),
  };
};

const addQuestion = async({state, request, response, params, render}) => {
  const user = await state.session.get("user");

  if (!user) {
    console.log("only authenticated users can add questions")
    return;
  }

  const data = await getQuestionData(request);

  const [passes, errors] = await validasaur.validate(
    data,
    questionRules,
  );

  if (!passes) {
    console.log(errors);
    data.errors = errors;
    data.topic = await topicService.getTopicById(params.id);
    data.questions = await questionService.getQuestionsByTopic(params.id);
    render("topic.eta", data);
  } else {
    await questionService.addQuestion(
      user.id,
      params.id,
      data.question_text,
    ); 

    response.redirect(`/topics/${params.id}`)
  }
};

const showQuestionById = async({params, render}) => {
  const questionId = params.qId;

  const question = await questionService.getQuestionById(questionId);
  const options = await optionService.getOptionsForId(questionId);
  const topic = await topicService.getTopicById(params.tId);

  render("question.eta", {question: question, options: options, topic: topic})
};

const deleteQuestion = async({response, params, state}) => {
  const user = await state.session.get("user"); 

  if (!user) {
    console.log("Only authenticated users can delete questions");
    return;
  };

  await questionService.deleteQuestion(params.qId);

  response.redirect(`/topics/${params.tId}`)
};


export { addQuestion, showQuestionById, deleteQuestion };