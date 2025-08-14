module.exports = (sequelize, DataTypes) => {
  const Borrowing = sequelize.define("Borrowing", {
    borrowDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "borrowed",
    },
  });

  Borrowing.associate = (models) => {
    Borrowing.belongsTo(models.Book, { foreignKey: "bookId", as: "book" });
    Borrowing.belongsTo(models.Borrower, {
      foreignKey: "borrowerId",
      as: "borrower",
    });
  };

  return Borrowing;
};
