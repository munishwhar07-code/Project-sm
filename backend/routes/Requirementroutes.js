const express = require("express");
const router  = express.Router();
const {
  createRequirement,
  getMatches,
  getAllRequirements,
  deleteRequirement,
} = require("../controller/Requirementcontroller");

router.get("/",              getAllRequirements);
router.post("/",             createRequirement);
router.get("/:id/matches",   getMatches);
router.delete("/:id",        deleteRequirement);

module.exports = router;