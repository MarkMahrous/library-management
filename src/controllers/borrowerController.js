const { Borrower } = require("../models");

exports.createBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.create(req.body);
    res.status(201).json(borrower);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.findAll();
    res.json(borrowers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBorrowerById = async (req, res) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) return res.status(404).json({ error: "Borrower not found" });
    res.json(borrower);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) return res.status(404).json({ error: "Borrower not found" });
    await borrower.update(req.body);
    res.json(borrower);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) return res.status(404).json({ error: "Borrower not found" });
    await borrower.destroy();
    res.json({ message: "Borrower deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
