require('express-async-errors')
const jwt = require('jsonwebtoken')
const express = require('express')
const { Blog, User } = require('../models')
const router = express.Router()

const { SECRET } = require('../utils/config')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch (error) {
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

router.post('/', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    console.log(JSON.stringify(user), null, 2)
    const blog = await Blog.create({ ...req.body, UserId: user.id })
    res.json(blog)
})

router.delete('/:id', tokenExtractor, async (req, res) => {
    const delete_rows = await Blog.destroy({ where: { id: Number.parseInt(req.params.id) } })
    if (delete_rows == 1) {
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.put('/:id', blogFinder, tokenExtractor, async (req, res) => {
    if (req.blog) {
        req.blog.likes = Number.parseInt(req.body.likes)
        await req.blog.save()
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

module.exports = router