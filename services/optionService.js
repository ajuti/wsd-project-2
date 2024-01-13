import { sql } from "../database/database.js";

const getOptionsForId = async(qId) => {
  return await sql`SELECT * FROM question_answer_options WHERE question_id=${qId}`;
};

const addOptionForId = async(qId, text, is_correct) => {
  await sql`INSERT INTO question_answer_options(question_id, option_text, is_correct) VALUES (${qId}, ${text}, ${is_correct})`;
};

const deleteOption = async(oId) => {
  await sql`DELETE FROM question_answers WHERE question_answer_option_id=${oId}`;
  await sql`DELETE FROM question_answer_options WHERE id=${oId}`;
};

const getOptionById = async(oId) => {
  return (await sql`SELECT * FROM question_answer_options WHERE id=${oId}`)[0];
};

const getCorrectByQid = async(qId) => {
  return (await sql`SELECT * FROM question_answer_options WHERE question_id=${qId} AND is_correct=true`);
};

const getOptionsForIdApi = async(qId) => {
  return await sql`SELECT id, option_text FROM question_answer_options WHERE question_id=${qId}`;
};

export { getOptionsForId, addOptionForId, deleteOption, getOptionById, getCorrectByQid, getOptionsForIdApi };