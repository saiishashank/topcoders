const express = require("express");
const router = express.Router();
const {
  getallusers,
  getuserbyid,
  updateuser,
  deleteuser,
  getme,
  getrating,
  updateAllUserRatings,
  getRatingHistoryById,
  getMyRatingHistory,
} = require("../controller/usercontroller");
const { protect} = require("../controller/authcontroller");
router.get("/getusers", protect,getallusers);
router.get("/getme", protect, getme);
router.get("/getuser/:id", protect, getuserbyid);
router.patch("/updateuser/:id", protect, updateuser);
router.delete("/deleteuser/:id", protect, deleteuser);
router.get("/getrating", protect, getrating);
router.get("/updateratings", updateAllUserRatings);
router.get("/getratinghistory/:id",protect, getRatingHistoryById);
router.get("/me/getmyratinghistory",protect, getMyRatingHistory);
module.exports = router;
