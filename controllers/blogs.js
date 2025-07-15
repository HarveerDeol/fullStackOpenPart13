const router = require('express').Router()
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  }

router.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll()
    console.log(blogs.map(b=>b.toJSON()))
    res.json(blogs)
  })

router.get('/api/notes/:id', async (req, res) => {
    if (req.blog) {
        console.log(req.blog.toJSON())
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
    })
  
router.post('/api/blogs', async (req, res) => {
    try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
    } catch(error) {
    return res.status(400).json({ error })
    }
})

router.delete('/:id', async (req, res) => {
    if (req.blog) {
      await req.blog.destroy()
    }
    res.status(204).end()
  })

router.put('/api/blogs/:id', async (req, res) => {
    if (req.blog) {
        req.blog.important = req.body.important
        await req.blog.save()
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
    })

module.exports = router