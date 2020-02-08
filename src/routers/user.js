const express = require('express')
const User = require('../models/user')
const auth = require('../middlewares/auth')

const router = new express.Router()

router.post('/users', async (req,res) => {
    const user = new User(req.body)
    
    try{
        await user.save()
        const token = await user.genAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/login', async(req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password)
        const token = await user.genAuthToken()
        res.send({ user , token })
    }catch(err) {   
        res.status(400).send(`${err}`)
    }
})

router.post('/users/logout', auth , async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
            await req.user.save()
            
            res.send('Successfully logged out!!')
        
    } catch (err) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth , async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Successfully logged out of all!!')
    } catch (err) {
        res.status(500).send()
    }
})

router.get('/users/me', auth , async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', auth , async (req,res) => {
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
    
    try {
        const user = await User.findById(_id)
        if(!user) {
            return res.status(404).send('user not found')
        }

        updates.forEach((update) => user[update] = req.body[update])                    //user[update] is syntax for dynamically writing user.property as we 
        await user.save()                                                               //can't use user.property as we explicitly don't know the name of the 
        res.send(user)                                                                  //property which is being updated

        // const user = await User.findByIdAndUpdate(_id, req.body, {new : true, runValidators : true})
        
        // we can't use the above written mongoose query as it will bypass advance middleware functionality so we explicitly have to se properties like 
        // running validators to true to run validation but in case of hashing passwords it becomes quite lengthy and a bit messy so avoid it if we are 
        // gonna use some mongoose middleware 

        // read mongoose middleware docs for more info
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