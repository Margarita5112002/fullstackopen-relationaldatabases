const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { Session, User } = require('../models')

const errorHandler = async (error, req, res, next) => {
    console.log('error name', error.name)
    if (error.name === 'SequelizeValidationError') {
        const messages = []
        error.errors.forEach(e => {
            messages.push(e.message)
        })
        return res.status(400).json({errors: messages})
    }
    if (error.name === 'SequelizeDatabaseError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
      try {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
        const user = await User.findByPk(req.decodedToken.id)
        if (!user) {
            return res.status(401).json({ error: "token invalid" });
        }
        if (user.disabled) {
            return res.status(401).json({ error: "account disabled, please contact admin" })
        }
        const sessions = await Session.findAll({
            where: { userId: req.decodedToken.id }
        })
        if (sessions.length == 0) {
            return res.status(401).json({ error: "expired token" })
        }
      } catch (error) {
        return res.status(401).json({ error: "token invalid" });
      }
    } else {
      return res.status(401).json({ error: "token missing" });
    }
    next();
};

module.exports = {
    errorHandler, tokenExtractor
}