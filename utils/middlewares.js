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

module.exports = {
    errorHandler
}