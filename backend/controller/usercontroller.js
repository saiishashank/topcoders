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

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

  
    const results = users.map(user => ({
      username: user.username,
      codechefProfile: user.codechefProfile,
      codeforcesProfile: user.codeforcesProfile,
      codechefrating: user.codechef_rating,
      codeforcesrating: user.codeforces_rating,
    }));

    res.json({ users: results });
  } catch (err) {
    console.error("Error fetching ratings from DB:", err);
    res.status(500).json({ error: "Failed to fetch ratings from database." });
  }
};

const updateAllUserRatings = async (req, res) => {
  try {
    // Fetch all users with their profiles and ID
    const users = await db.query(
      "SELECT id, codechefProfile, codeforcesProfile FROM users"
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found to update" });
    }

    // Process ratings for each user
    await Promise.all(
      users.map(async (user) => {
        let finalCodechefRating = "N/A";
        let finalCodeforcesRating = "N/A";

        // 1. Get CodeChef Rating
        if (user.codechefProfile) {
          try {
            const rating = await scrapeCodechefRating(user.codechefProfile);
            if (rating) {
              finalCodechefRating = rating;
            }
          } catch (err) {
            console.error(`Error scraping CodeChef for ${user.codechefProfile}:`, err.message);
          }
        }

        // 2. Get Codeforces Rating
        if (user.codeforcesProfile) {
          try {
            const cfResponse = await axios.get(
              `https://codeforces.com/api/user.rating?handle=${user.codeforcesProfile}`
            );
            if (cfResponse.data.status === "OK") {
              const cfResult = cfResponse.data.result;
              if (cfResult && cfResult.length > 0) {
                finalCodeforcesRating = cfResult[cfResult.length - 1].newRating.toString();
              } 
            }
          } catch (err) {
            console.error(`Error fetching Codeforces for ${user.codeforcesProfile}:`, err.message);
          }
        }

        // 3. Update the database with the new ratings
        try {
            const updateQuery = "UPDATE users SET codechef_rating = ?, codeforces_rating = ? WHERE id = ?";
            await db.query(updateQuery, [finalCodechefRating, finalCodeforcesRating, user.id]);
        } catch(dbError) {
            console.error(`Failed to update DB for user ID ${user.id}:`, dbError);
        }
      })
    );

    res.status(200).json({ message: "User ratings update process completed." });

  } catch (err) {
    console.error("A critical error occurred in the updateAllUserRatings controller:", err);
    res.status(500).json({ error: "Failed to update ratings due to a server error." });
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
};
