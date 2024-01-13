import { sql } from "../database/database.js";

const saveAnswer = async(uId, qId, oId) => {
  await sql`INSERT INTO question_answers(user_id, question_id, question_answer_option_id) VALUES (${uId}, ${qId}, ${oId})`;
};

export { saveAnswer };