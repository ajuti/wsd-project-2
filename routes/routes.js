import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as questionController from "./controllers/questionController.js";
import * as optionController from "./controllers/optionController.js";
import * as authController from "./controllers/authController.js";
import * as quizController from "./controllers/quizController.js";
import * as quizApi from "./apis/questionApi.js";

const router = new Router();

router.get("/", mainController.showMain);
router.get("/topics", topicController.showTopics);
router.post("/topics", topicController.addTopic);
router.post("/topics/:id/delete", topicController.deleteTopic);
router.get("/topics/:id", topicController.showTopicById);

router.post("/topics/:id/questions", questionController.addQuestion);
router.get("/topics/:id/questions/:qId", questionController.showQuestionById);
router.post("/topics/:tId/questions/:qId/delete", questionController.deleteQuestion);

router.post("/topics/:id/questions/:qId", optionController.addOption);
router.post("/topics/:tId/questions/:qId/options/:oId/delete", optionController.deleteOption);

router.get("/auth/register", authController.showRegistration);
router.post("/auth/register", authController.registerUser);
router.get("/auth/login", authController.showLogin);
router.post("/auth/login", authController.loginUser);

router.post("/auth/logout", authController.logout);
router.get("/auth/logout", authController.logout);

router.get("/quiz", quizController.showQuiz);
router.get("/quiz/:tId", quizController.showTopic);
router.get("/quiz/:tId/questions/:qId", quizController.showQuestion);
router.post("/quiz/:tId/questions/:qId/options/:oId", quizController.submitOption);

router.get("/api/questions/random", quizApi.getRandom);
router.post("/api/questions/answer", quizApi.postAnswer);

// router.get("/test", authController.test);

export { router };
