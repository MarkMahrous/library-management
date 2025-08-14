require("dotenv").config();
const app = require("./src/app");
const { sequelize } = require("./src/models");

const PORT = process.env.PORT || 5000;

// Sync DB then start server
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected!");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Unable to connect to database:", err);
  });
