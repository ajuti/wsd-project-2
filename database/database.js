import { postgres } from "../deps.js";

let sql;
if (Deno.env.get("DATABASE_URL")) {
  console.log("Connecting into a database via env variable...")
  sql = postgres(Deno.env.get("DATABASE_URL"));
} else {
  sql = postgres({});
}

export { sql };
