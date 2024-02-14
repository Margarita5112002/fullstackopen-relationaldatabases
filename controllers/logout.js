require('express-async-errors')
const express = require('express')
const { tokenExtractor } = require('../utils/middlewares')
const { Session } = require('../models')

const router = express.Router()

router.delete('/', tokenExtractor, async (req, res) => {
    await Session.destroy({
        where: {
            userId: req.decodedToken.id
        }
    })
    res.status(204).end()
})

module.exports = router