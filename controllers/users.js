const router = require('express').Router()
const { User } = require('../models')

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      } catch{
        return res.status(401).json({ error: 'token invalid' })
      }
    }  else {
      return res.status(401).json({ error: 'token missing' })
    }
    next()
  }

  router.get('/', async (req, res) => {
    const notes = await Note.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: { exclude: ['userId'] }
      }
    })
    res.json(notes)
  })

router.post('/', tokenExtractor, async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const note = await Note.create({...req.body, userId: user.id, date: new Date()})
        res.json(note)
      } catch(error) {
        return res.status(400).json({ error })
      }
    })

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router