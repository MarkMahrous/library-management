module.exports = (sequelize, DataTypes) => {
  const Borrower = sequelize.define("Borrower", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    registeredDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  });

  Borrower.associate = (models) => {
    Borrower.hasMany(models.Borrowing, {
      foreignKey: "borrowerId",
      as: "borrowings",
    });
  };

  return Borrower;
};
