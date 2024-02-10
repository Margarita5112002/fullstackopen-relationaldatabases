const express = require('express')
const { Blog } = require('../models')
const router = express.Router()

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})

router.post('/', async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        res.json(blog)
    } catch (error) {
        res.status(400).json({error})
    }
})

router.delete('/:id', async (req, res) => {
    const delete_rows = await Blog.destroy({ where: { id: Number.parseInt(req.params.id) } })
    if (delete_rows == 1) {
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

module.exports = router