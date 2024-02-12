require('express-async-errors')
const express = require('express')
const { Blog } = require('../models')
const { sequelize } = require('../utils/db')

const router = express.Router()

router.get('/', async (req, res) => {
    const authors = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
            [sequelize.fn('COUNT', sequelize.col('author')), 'articles']
        ],
        group: 'author'
    })
    res.json(authors)
})

module.exports = router