require('express-async-errors')
const express = require('express')
const { Blog } = require('../models')
const router = express.Router()

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})

router.post('/', async (req, res) => {
    const blog = await Blog.create(req.body)
    res.json(blog)
})

router.delete('/:id', async (req, res) => {
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

router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        req.blog.likes = Number.parseInt(req.body.likes)
        await req.blog.save()
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

module.exports = router