const express = require("express");
const router = express.Router();

const {
  getBrands,
  getBrandById,
  updateStatus,
  addNote,
  getSummary,
  createBrand  
} = require("../controllers/brandController");

router.get("/", getBrands);
router.get("/summary", getSummary);
router.get("/:id", getBrandById);
router.patch("/:id/status", updateStatus);
router.post("/:id/notes", addNote);
router.post("/", createBrand);

module.exports = router;