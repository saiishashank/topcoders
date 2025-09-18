require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../database");
const secret_key = process.env.SECRET_KEY;

const register = async (req, res) => {
  const { username, email, password, codeforcesProfile, codechefProfile } = req.body;
  try {
      const query =
      "INSERT INTO users (username, email, password, \"codeforcesProfile\", \"codechefProfile\") VALUES ($1, $2, $3, $4, $5) RETURNING id";
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const result = await db.query(query, [username, email, hash, codeforcesProfile, codechefProfile]);

      const newUserId = result[0].id;

    const payload = {
      id: newUserId, 
      email: email,
      username: username,
      codeforcesProfile: codeforcesProfile,
      codechefProfile: codechefProfile,
    };

    const token = jwt.sign(payload, secret_key, {
      expiresIn: "1h",
    });
    
    res.status(201).send({
      msg: "successfully registered",
      token: token,
    });
  } catch (err) {
    console.log("register error:", err);
    res.status(500).send("server error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email=$1"; 
  try {
    const result = await db.query(query, [email]);
    if (result.length === 0) {
      return res.status(400).send("user not found");
    }
    const user = result[0];
    const password_match = await bcrypt.compare(password, user.password);
    if (!password_match) {
      return res.status(400).send("invalid password");
    }
    const payload = {
      email: user.email,
      id: user.id,
      username: user.username,
      codeforcesProfile: user.codeforcesProfile,
      codechefProfile: user.codechefProfile,
    };
    const token = jwt.sign(payload, secret_key, {
      expiresIn: "1h",
    });
    res.status(200).send({
      msg: "successfully logged in",
      token: token,
    });
  } catch (err) {
    console.log("login error", err);
    res.send("server error");
  }
};

const protect = (req, res, next) => {
 
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, secret_key);
      req.user = decoded;
      next();
    } catch (err) {
      console.log("invalid token", err);
      res.send("invalid token");
    }
  }
  if (!token) {
    res.send("not authorized, no token provided");
  }
};

module.exports = { register, login, protect };