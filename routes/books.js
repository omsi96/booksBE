const express = require("express");
const router = express.Router();
const {
  bookCreateController,
  getSingleBookController,
  deleteBookController,
  updateBookController,
  getAllBooksController,
} = require("../controllers/booksController");
const upload = require("../middleware/multer");
// ROUTES: GET

router.get("/", getAllBooksController);
router.get("/:bookId", getSingleBookController);
router.post("/create", upload.single("image"), bookCreateController);
router.delete("/:bookId", deleteBookController);
router.put("/:bookId", updateBookController);

module.exports = router;