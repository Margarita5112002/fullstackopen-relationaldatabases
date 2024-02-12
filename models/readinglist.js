const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Readinglist extends Model {}

Readinglist.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    blog_id: {
        type: DataTypes,
        allowNull: false,
        references: { model: 'blogs', key: 'id' }
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    model: 'readinglist'
})

module.exports = Readinglist