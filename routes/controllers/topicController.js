import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";

const topicRules = {
  name: [validasaur.required, validasaur.minLength(1)],
};

const getTopicData = async(request) => {
  const body = request.body({type: "form"});
  const params = await body.value;

  return {
    name: params.get("name")
  };
};

const addTopic = async({state, request, response, render}) => {
  const user = await state.session.get("user");

  if (!user || !user.admin) {
    console.log("Only admins have privileges to add topics")
    return;
  }

  const topicData = await getTopicData(request);
  const [passes, errors] = await validasaur.validate(
    topicData,
    topicRules,
  );

  if (!passes) {
    console.log(errors);
    topicData.errors = errors;
    topicData.topics = await topicService.getTopics();
    render("topics.eta", topicData);
  } else {
    await topicService.addTopic(
      user.id,
      topicData.name,
    );

    response.redirect("/topics");
  };
};

const deleteTopic = async({state, params, response}) => {
  console.log("controller");
  const user = await state.session.get("user");

  if (!user || !user.admin) {
    console.log("Only admins have privileges to delete topics")
    return;
  }

  const id = params.id
  await topicService.deleteTopic(id);
  response.redirect("/topics");
};

const showTopics = async({render}) => {
  const topics = await topicService.getTopics();
  const topicData = {
    topics: topics,
  };

  render("topics.eta", topicData);
};

const showTopicById = async({render, params, response}) => {
  const id = params.id;
  const topic = await topicService.getTopicById(id);
  
  if (!topic) {
    console.log("No topic found with given id");
    response.redirect("/topics")
  } else {
    const questions = await questionService.getQuestionsByTopic(id);
    render("topic.eta", {
      topic: topic,
      questions: questions,
    });
  };
};

export { addTopic, deleteTopic, showTopics, showTopicById };