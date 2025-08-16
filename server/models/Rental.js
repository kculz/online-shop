module.exports = (sequelize, DataTypes) => {
  const Rental = sequelize.define('Rental', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'OrderItems',
        key: 'id'
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    actualReturnDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    depositAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    depositStatus: {
      type: DataTypes.ENUM('held', 'refunded', 'partially_refunded'),
      defaultValue: 'held'
    },
    lateFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('active', 'returned', 'overdue', 'cancelled'),
      defaultValue: 'active'
    }
  });

  Rental.associate = function(models) {
    Rental.belongsTo(models.OrderItem, {
      foreignKey: 'orderItemId',
      as: 'orderItem'
    });
  };

  return Rental;
};