import { sql } from "../database/database.js"

const addTopic = async(user, name) => {
  await sql`INSERT INTO topics(user_id, name) VALUES (${user}, ${name})`;
};

const deleteTopic = async(id) => {
  await sql`DELETE FROM question_answers
    USING questions
    WHERE questions.id=question_answers.question_id
    AND questions.topic_id=${id}`;
  await sql`DELETE FROM question_answer_options
    USING questions
    WHERE questions.id=question_answer_options.question_id
    AND questions.topic_id=${id}`;
  await sql`DELETE FROM questions WHERE topic_id=${id}`;
  await sql`DELETE FROM topics WHERE id=${id}`;
};

const getTopicById = async(id) => {
  return (await sql`SELECT * FROM topics WHERE id=${id}`)[0];
};

const getTopics = async() => {
  return await sql`SELECT * FROM topics ORDER BY name`;
};

export { addTopic, deleteTopic, getTopicById, getTopics };