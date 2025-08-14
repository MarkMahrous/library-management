const { Borrowing, Book, Borrower } = require("../models");
const { Op } = require("sequelize");

// Borrow a book
exports.borrowBook = async (req, res) => {
  try {
    const { borrowerId, bookId, dueDate } = req.body;

    const borrower = await Borrower.findByPk(borrowerId);
    if (!borrower) return res.status(404).json({ error: "Borrower not found" });

    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (book.availableQuantity < 1) {
      return res.status(400).json({ error: "Book not available" });
    }

    const borrowing = await Borrowing.create({
      borrowerId,
      bookId,
      borrowDate: new Date(),
      dueDate,
      status: "borrowed",
    });

    // Reduce available quantity
    await book.update({ availableQuantity: book.availableQuantity - 1 });

    res.status(201).json(borrowing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all borrowings
exports.getAllBorrowings = async (req, res) => {
  try {
    const borrowings = await Borrowing.findAll({
      include: [
        { model: Book, as: "book" },
        { model: Borrower, as: "borrower" },
      ],
    });
    res.json(borrowings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const borrowing = await Borrowing.findByPk(req.params.id);
    if (!borrowing)
      return res.status(404).json({ error: "Borrowing record not found" });
    if (borrowing.status === "returned") {
      return res.status(400).json({ error: "Book already returned" });
    }

    borrowing.status = "returned";
    borrowing.returnDate = new Date();
    await borrowing.save();

    // Increase available quantity
    const book = await Book.findByPk(borrowing.bookId);
    await book.update({ availableQuantity: book.availableQuantity + 1 });

    res.json(borrowing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get books a borrower currently has
exports.getBorrowerBooks = async (req, res) => {
  try {
    const borrowings = await Borrowing.findAll({
      where: {
        borrowerId: req.params.borrowerId,
        status: "borrowed",
      },
      include: [{ model: Book, as: "book" }],
    });

    res.json(borrowings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List overdue books
exports.getOverdueBooks = async (req, res) => {
  try {
    const today = new Date();
    const overdue = await Borrowing.findAll({
      where: {
        dueDate: { [Op.lt]: today },
        status: "borrowed",
      },
      include: [
        { model: Book, as: "book" },
        { model: Borrower, as: "borrower" },
      ],
    });

    res.json(overdue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
