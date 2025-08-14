module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    shelfLocation: {
      type: DataTypes.STRING,
    },
  });

  Book.associate = (models) => {
    Book.hasMany(models.Borrowing, { foreignKey: "bookId", as: "borrowings" });
  };

  return Book;
};
