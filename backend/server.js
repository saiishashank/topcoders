const express = require("express");
const app = express();
const cors=require('cors');
const authroutes = require("./routes/authroutes");
const userroutes = require("./routes/userroutes");

app.use(express.json());
app.use(cors());

app.use("/api/auth", authroutes);
app.use("/api/user", userroutes);

app.listen(5000, () => {
  console.log("server running on port 5000");
});
