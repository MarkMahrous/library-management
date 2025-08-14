const { Book } = require("../models");

exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    await book.update(req.body);
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    await book.destroy();
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { title, author, isbn } = req.query;
    const { Op } = require("sequelize");

    const whereClause = {};
    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` }; // case-insensitive
    }
    if (author) {
      whereClause.author = { [Op.iLike]: `%${author}%` };
    }
    if (isbn) {
      whereClause.isbn = { [Op.iLike]: `%${isbn}%` };
    }

    const books = await Book.findAll({ where: whereClause });

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
