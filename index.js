require('dotenv').config()
const express = require('express')
const { Sequelize, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model {}

Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})

const app = express()
app.use(express.json())
app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll()
    res.send(blogs)
})

const PORT = process.env.PORT | 3001

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})