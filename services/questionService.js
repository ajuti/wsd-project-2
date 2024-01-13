import { sql } from "../database/database.js";

const getQuestionsByTopic = async(id) => {
  return await sql`SELECT * FROM questions WHERE topic_id=${id}`;
};

const addQuestion = async(user_id, topic_id, question_text) => {
  await sql`INSERT INTO questions(user_id, topic_id, question_text) VALUES
    (${user_id}, ${topic_id}, ${question_text})`;
};

const getQuestionById = async(qId) => {
  return (await sql`SELECT * FROM questions WHERE id=${qId}`)[0];
};

const deleteQuestion = async(qId) => {
  await sql`DELETE FROM question_answers WHERE question_id=${qId}`;
  await sql`DELETE FROM question_answer_options WHERE question_id=${qId}`;
  await sql`DELETE FROM questions WHERE id=${qId}`;
};

const getRandomQuestion = async() => {
  const rows = (await sql`SELECT * FROM questions ORDER BY RANDOM() LIMIT 1`);

  if (rows.length === 0) {
    return false; 
  };

  return rows[0];
};

const checkCorrectAnswer = async (id, question_id) => {
  const rows = await sql`
  SELECT is_correct
  FROM question_answer_options
  WHERE id = ${ id }
  AND 
  question_id = ${ question_id }`;

  if (rows && rows.length > 0) {
    return rows[0].is_correct;
  }

  return false;
};

const getQuestionCount = async() => {
  return (await sql`SELECT COUNT(*) FROM questions`)[0];
};

const getAnswerCount = async() => {
  return (await sql`SELECT COUNT(*) FROM question_answers`)[0];
};

export { getQuestionsByTopic, addQuestion, getQuestionById, deleteQuestion, getRandomQuestion, checkCorrectAnswer, getQuestionCount, getAnswerCount };