const express = require("express");
const router = express.Router();
const {
  getallusers,
  getuserbyid,
  updateuser,
  deleteuser,
  getme,
  getrating
} = require("../controller/usercontroller");
const { protect} = require("../controller/authcontroller");
router.get("/getusers", protect,getallusers);
router.get("/getme", protect, getme);
router.get("/getuser/:id", protect, getuserbyid);
router.patch("/updateuser/:id", protect, updateuser);
router.delete("/deleteuser/:id", protect, deleteuser);
router.get("/getrating", protect, getrating);
module.exports = router;
