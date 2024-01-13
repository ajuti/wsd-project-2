import { app } from "../app.js";
import { superoak } from "../deps.js";

Deno.test({
  name: "GET request to /api/questions/random should return a random question with options in JSON",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/api/questions/random")
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"))
      .expect(
        {
          "questionId": 1,
          "questionText": "Who is the fastest man on earth?",
          "answerOptions": [
            {"optionId": 1, "optionText": "Steve Jobs"},
            {"optionId": 2, "optionText": "Usain Bolt"},
            {"optionId": 3, "optionText": "Lionel Messi"},
          ]
        })
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "POST request to /api/questions/answer with correct answer should return { correct: true }",
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer")
      .send({"optionId": 2, "questionId": 1})
      .expect(200)
      .expect({ correct: true })
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "POST request to /api/questions/answer with incorrect answer should return { correct: false }",
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer")
      .send({"optionId": 1, "questionId": 1})
      .expect(200)
      .expect({ correct: false })
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "POST request to /api/questions/answer with invalid question id should also return { correct: false }",
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer")
      .send({"optionId": 1, "questionId": 2})
      .expect(200)
      .expect({ correct: false })
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
