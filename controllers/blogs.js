const express = require('express')
const router = express.Router()
const { Blog } = require('../models')


const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  }

  return res.status(500).json({ error: 'Something went wrong' })
}


const blogFinder = async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) return res.status(404).json({ error: 'Blog not found' })

    req.blog = blog
    next()
  } catch (error) {
    next(error)
  }
}


router.get('/api/blogs', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

router.get('/api/blogs/:id', blogFinder, (req, res) => {
  res.json(req.blog)
})

router.post('/api/blogs', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
    res.status(201).json(blog)
  } catch (error) {
    next(error)
  }
})

router.put('/api/blogs/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/api/blogs/:id', blogFinder, async (req, res, next) => {
  try {
    await req.blog.destroy()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

// Register error handler
router.use(errorHandler)

module.exports = router
