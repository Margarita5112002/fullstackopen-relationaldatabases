const { Model, DataTypes } = require("sequelize");
const { sequelize } = require('../utils/db')

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
}, {
    sequelize,
    underscored: true,
    modelName: "user"
})

module.exports = User