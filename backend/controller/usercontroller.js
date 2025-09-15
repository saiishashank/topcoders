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
    const query =
      "SELECT username, codechefProfile, codeforcesProfile, codechef_rating, codeforces_rating FROM users";
    const users = await db.query(query);
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ratings from database." });
  }
};

const updateAllUserRatings = async (req, res) => {
  try {
    const users = await db.query("SELECT id, codechefProfile, codeforcesProfile FROM users");
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found to update" });
    }

    for (const user of users) {
      const today = new Date();

      // Codeforces Snapshot Logic
      if (user.codeforcesProfile) {
        try {
          const cfResponse = await axios.get(`https://codeforces.com/api/user.rating?handle=${user.codeforcesProfile}`);
          if (cfResponse.data.status === "OK") {
            const cfHistory = cfResponse.data.result;
            if (cfHistory && cfHistory.length > 0) {
              const latestRating = cfHistory[cfHistory.length - 1].newRating;
              await db.query("UPDATE users SET codeforces_rating = ? WHERE id = ?", [latestRating.toString(), user.id]);
              await db.query("INSERT INTO rating_history (user_id, platform, rating, contest_date) VALUES (?, ?, ?, ?)", [user.id, "codeforces", latestRating, today]);
            }
          }
        } catch (err) { console.error(`Error for Codeforces user ${user.codeforcesProfile}:`, err.message); }
      }

      // CodeChef Snapshot Logic
      if (user.codechefProfile) {
        try {
          const rating = await scrapeCodechefRating(user.codechefProfile);
          if (rating) {
            await db.query("UPDATE users SET codechef_rating = ? WHERE id = ?", [rating.toString(), user.id]);
            await db.query("INSERT INTO rating_history (user_id, platform, rating, contest_date) VALUES (?, ?, ?, ?)", [user.id, "codechef", rating, today]);
          }
        } catch (err) { console.error(`Error for CodeChef user ${user.codechefProfile}:`, err.message); }
      }
    }
    res.status(200).json({ message: "User ratings and history update process completed." });
  } catch (err) {
    console.error("Critical error in updateAllUserRatings:", err);
    res.status(500).json({ error: "Server error during rating update." });
  }
};

const getRatingHistoryByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const query = "SELECT platform, rating, contest_date FROM rating_history WHERE user_id = (SELECT id FROM users WHERE username = ?) ORDER BY contest_date ASC";
    const history = await db.query(query, [username]);
    res.json(history);
  } catch (err) {
    console.error("Error fetching rating history:", err);
    res.status(500).json({ error: "Failed to fetch rating history." });
  }
};

const getMyRatingHistory = async (req, res) => {
  try {
    // 1. Get token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    // 2. Verify the token to get the user's ID
    const decoded = jwt.verify(token, secret_key);
    const userId = decoded.id;

    // 3. Fetch history using the ID from the token
    const query = "SELECT platform, rating, contest_date FROM rating_history WHERE user_id = ? ORDER BY contest_date ASC";
    const history = await db.query(query, [userId]);

    res.json(history);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token." });
    }
    console.error("Error fetching rating history:", err);
    res.status(500).json({ error: "Failed to fetch rating history." });
  }
};

module.exports = {
  getallusers,
  getuserbyid,
  updateuser,
  deleteuser,
  getme,
  getrating,
  updateAllUserRatings,
  getRatingHistoryByUsername,
  getMyRatingHistory,
 
};
