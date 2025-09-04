const mysql = require("mysql2/promise");

const dbconfig = {
  host: "localhost",
  user: "root",
  password: "Shashank@2004",
  database: "topcoders",
};
const db = mysql.createPool(dbconfig);
const query = async (sql, params) => {
  const [results] = await db.execute(sql, params);
  return results;
};
module.exports = { query };
