module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Orders',
                key: 'id'
            }
        },
        paymentMethod: {
            type: DataTypes.ENUM('ecocash', 'visa', 'mastercard', 'zipit'),
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true // Only required for mobile payments
        },
        status: {
            type: DataTypes.ENUM('pending', 'paid', 'failed', 'cancelled'),
            defaultValue: 'pending'
        },
        paynowReference: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pollUrl: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        invoiceNo: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: true
    });

    Payment.associate = function(models) {
        Payment.belongsTo(models.Order, {
            foreignKey: 'orderId',
            as: 'order'
        });
    };

    return Payment;
};