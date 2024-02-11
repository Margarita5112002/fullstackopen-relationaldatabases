require('express-async-errors')
const express = require('express')
const { User } = require('../models')

const router = express.Router()

router.post('/', async (req, res) => {
    const user = await User.create(req.body)
    res.status(201).json(user)
})

router.get('/', async (req, res) => {
    const users = await User.findAll()
    res.json(users)
})

router.put('/:username', async (req, res) => {
    const user = await User.findOne({
        where: { username: req.params.username }
    })
    if (user) {
        if (req.body.name) {
            user.name = req.body.name
        }
        if (req.body.username) {
            user.username = req.body.username
        }
        await user.save()
        res.json(user)
    } else {
        res.status(404).end()
    }
})

module.exports = router
