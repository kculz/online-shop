module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        stockQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        canBeRented: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        rentalPricePerDay: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            validate: {
                min: 0
            }
        },
        rentalDeposit: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            validate: {
                min: 0
            }
        },
        minRentalDays: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1
            }
        },
        maxRentalDays: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1
            }
        }
    }, {
        timestamps: true
    });

    // Define associations
    Product.associate = (models) => {
        Product.belongsTo(models.Category, {
            foreignKey: {
                name: 'categoryId',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
    };

    return Product;
};