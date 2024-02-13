require("express-async-errors");
const { Op } = require("sequelize");
const express = require("express");
const { Blog, User } = require("../models");
const { tokenExtractor } = require('../utils/middlewares')
const router = express.Router();

router.get("/", async (req, res) => {
  let where = {};
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["UserId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [
        ['likes', 'DESC']
    ]
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.json(blog);
});

router.delete("/:id", tokenExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    return res.status(404).end();
  }
  if (blog.UserId != req.decodedToken.id) {
    return res.status(401).json({ error: "user cannot delete this blog" });
  }
  const delete_rows = await Blog.destroy({
    where: { id: Number.parseInt(req.params.id) },
  });
  if (delete_rows == 1) res.status(204).end();
});

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.put("/:id", blogFinder, tokenExtractor, async (req, res) => {
  if (req.blog) {
    req.blog.likes = Number.parseInt(req.body.likes);
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
