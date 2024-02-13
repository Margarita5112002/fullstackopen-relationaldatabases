require("express-async-errors")
const express = require("express")
const { Readinglist } = require("../models")
const { tokenExtractor } = require("../utils/middlewares")
const router = express.Router()

router.post('/', async (req, res) => {
    const reading = await Readinglist.create({ ...req.body })
    res.json(reading)
})

router.put('/:id', tokenExtractor, async (req, res) => {
    const reading = await Readinglist.findByPk(req.params.id)
    if (reading.userId == req.decodedToken.id) {
        reading.read = req.body.read
        await reading.save()
        res.json(reading)
    } else {
        return res.status(401).json({ error: 'you cannot modified this reading' })
    }
})

module.exports = router