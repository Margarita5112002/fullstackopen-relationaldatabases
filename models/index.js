const Blog = require('./blog')
const User = require('./user')

User.sync()
Blog.sync()

module.exports = {
  Blog, User
}