const express = require('express')
const User = require('../models/user')

const router = express.Router()

router.post('/users', async (req,res) => {
    const user = new User(req.body)
    
    try{
        await user.save()
        res.status(201).send(user)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/users', async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/users/:id', async (req,res) => {
    const _id = req.params.id
    
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send(`${_id} is not a valid user_id`)  
      }
      try {
          const user = await User.findById(_id)
          if(!user){
              return res.status(404).send('User not found')
          }
          res.send(user)
      } catch (err) {
          res.status(500).send(err)
      }
})

router.patch('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id
    
        if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send(`${_id} is not a valid user_id`)  
          }

        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email','password','age']
        const isValidOperatioin = updates.every((update) => allowedUpdates.includes(update))

        if(!isValidOperatioin){
            return res.status(400).send({ error : 'Invalid Updates'})
        }
        
        const user = await User.findByIdAndUpdate(_id, req.body, {new : true, runValidators : true})

        if(!user) {
            return res.status(404).send('user not found')
        }
        res.send(user)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id

    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send(`${_id} is not a valid user_id`)  
      }
    
    try {
        const user = await User.findByIdAndDelete(_id)
    
        if(!user) {
            return res.status(404).send('User not found!')
        }
        res.send(user)
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router