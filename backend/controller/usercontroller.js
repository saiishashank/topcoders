const db = require("../database");
const bcrypt = require("bcrypt");
const secret_key = "SAI@SECRET_KEY";
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { scrapeCodechefRating } = require("../utils/codechefrating");
const getallusers = async (req, res) => {
  try {
    const query = "select * from users";
    const result = await db.query(query);
    return res.send(result);
  } catch (err) {
    console.log(err);
    res.send("error fetching users");
  }
};
const getuserbyid = async (req, res) => {
  try {
    const id = req.params.id;
    const query = "select * from users where id=?";
    const result = await db.query(query, [id]);
    res.send(result);
  } catch (err) {
    console.log("user not found", err);
    res.send("user not found");
  }
};

const updateuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const id = req.params.id;
    const query = "update users set email=?, password=? where id=?";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const result = await db.query(query, [email, hash, id]);
    res.send({
      msg: "user updated successfully",
      user: result,
    });
  } catch (err) {
    console.log("user not found", err);
    res.send("user not found");
  }
};

const deleteuser = async (req, res) => {
  const id = req.params.id;
  const query = "delete from users where id=?";
  const result = await db.query(query, [id]);
  res.send({
    msg: "user deleted successfully",
  });
};
const getme = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret_key);
    const user = await db.query("select * from users where id=?", [decoded.id]);
    res.send(user);
  } catch (err) {
    console.log("error fetching user data", err);
  }
};
const getrating = async (req, res) => {
  try {
    // Fetch all users with their profiles
    const users = await db.query(
      "SELECT username, codechefProfile, codeforcesProfile FROM users"
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    // Process ratings for each user
    const results = await Promise.all(
      users.map(async (user) => {
        // Set default values for ratings. This prevents errors later.
        let finalCodechefRating = "N/A";
        let finalCodeforcesRating = "N/A";

        // 1. Get CodeChef Rating safely
        try {
          const rating = await scrapeCodechefRating(user.codechefProfile);
          if (rating) {
            // Check if the scraper returned a valid value
            finalCodechefRating = rating;
          }
        } catch (err) {
          console.error(
            `Error scraping CodeChef for ${user.codechefProfile}:`,
            err.message
          );
        }

        // 2. Get Codeforces Rating safely
        try {
          const cfResponse = await axios.get(
            `https://codeforces.com/api/user.rating?handle=${user.codeforcesProfile}`
          );

          // IMPORTANT: Check if the response and its data exist before accessing them
          if (
            cfResponse &&
            cfResponse.data &&
            cfResponse.data.status === "OK"
          ) {
            const cfResult = cfResponse.data.result;
            if (cfResult && cfResult.length > 0) {
              // Get the user's latest rating
              finalCodeforcesRating = cfResult[cfResult.length - 1].newRating;
            } else {
              finalCodeforcesRating = "No contests";
            }
          }
        } catch (err) {
          // This catch block handles network errors or invalid usernames (404s)
          console.error(
            `Error fetching Codeforces for ${user.codeforcesProfile}:`,
            err.message
          );
        }

        // 3. Return the compiled data. These values are now always safe to access.
        return {
          username: user.username,
          codechefProfile: user.codechefProfile,
          codeforcesProfile: user.codeforcesProfile,
          codechefrating: finalCodechefRating,
          codeforcesrating: finalCodeforcesRating,
        };
      })
    );

    res.json({ users: results });
  } catch (err) {
    console.error(
      "A critical error occurred in the getrating controller:",
      err
    );
    res
      .status(500)
      .json({ error: "Failed to fetch ratings due to a server error." });
  }
};

module.exports = {
  getallusers,
  getuserbyid,
  updateuser,
  deleteuser,
  getme,
  getrating,
};
