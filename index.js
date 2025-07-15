require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // ❗️Use false in dev only
    },
  },
});

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.BOOLEAN
  },
  url: {
    type: DataTypes.DATE,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

Blog.sync()

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  console.log(blogs.map(b=>b.toJSON()))
  res.json(blogs)
})

app.get('/api/notes/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        console.log(blog.toJSON())
        res.json(blog)
    } else {
        res.status(404).end()
    }
    })

app.post('/api/blogs', async (req, res) => {
    try {
      const blog = await Blog.create(req.body)
      return res.json(blog)
    } catch(error) {
      return res.status(400).json({ error })
    }
  })

app.put('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        blog.important = req.body.important
        await blog.save()
        res.json(blog)
    } else {
        res.status(404).end()
    }
    })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
