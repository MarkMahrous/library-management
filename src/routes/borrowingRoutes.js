const express = require("express");
const router = express.Router();
const borrowingController = require("../controllers/borrowingController");

router.post("/", borrowingController.borrowBook); // Borrow a book
router.get("/", borrowingController.getAllBorrowings); // Get all borrowings
router.post("/:id/return", borrowingController.returnBook); // Return a book
router.get("/borrower/:borrowerId", borrowingController.getBorrowerBooks); // Books by borrower
router.get("/overdue", borrowingController.getOverdueBooks); // Overdue books

module.exports = router;
