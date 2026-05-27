const express = require("express");
const router  = express.Router();
const {
  getAllPGs,
  getPGById,
  createPG,
  updatePG,
  deletePG,
} = require("../controller/Pgcontroller");

router.get("/",          getAllPGs);      // GET /api/pgs/seed — dev only
router.get("/:id",       getPGById);
router.post("/",         createPG);
router.put("/:id",       updatePG);
router.delete("/:id",    deletePG);

module.exports = router;