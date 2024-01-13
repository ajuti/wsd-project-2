import { sql } from "../database/database.js";

const getUsedEmails = async() => {
  const emails = await sql`SELECT email FROM users;`
  const mapped = emails.map((x) => x.email);
  return mapped;
};

const registerUser = async(email, hash) => {
  await sql`INSERT INTO users(email, password) VALUES (${email}, ${hash})`;
};

const getUserByEmail = async(email) => {
  return (await sql`SELECT * FROM users WHERE email=${email}`)[0];
};

export { getUsedEmails, registerUser, getUserByEmail };