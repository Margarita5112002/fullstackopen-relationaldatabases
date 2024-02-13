require("express-async-errors")
const express = require("express")
const { Readinglist } = require("../models")
const router = express.Router()

router.post('/', async (req, res) => {
    const reading = await Readinglist.create({ ...req.body })
    res.json(reading)
})

module.exports = router