const express = require("express");
const app = express();

const bookRoutes = require("./routes/bookRoutes");
const borrowerRoutes = require("./routes/borrowerRoutes");
const borrowingRoutes = require("./routes/borrowingRoutes");

app.use(express.json());

// Routes
app.use("/books", bookRoutes);
app.use("/borrowers", borrowerRoutes);
app.use("/borrowings", borrowingRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Library Management API is running 🚀");
});

module.exports = app;
