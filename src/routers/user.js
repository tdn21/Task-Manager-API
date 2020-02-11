const express = require('express')
const User = require('../models/user')
const auth = require('../middlewares/auth')
const multer = require('multer')

const router = new express.Router()


// In comments ** means Authentication required

//Route to create new user
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

//Route to login user
router.post('/users/login', async(req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password)
        const token = await user.genAuthToken()
        res.send({ user , token })
    }catch(err) {   
        res.status(400).send(`${err}`)
    }
})

//Route to fetch user **
router.get('/users/me', auth , async (req, res) => {
    res.send(req.user)
})

//Route to upload profile pic
const avatar = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, avatar.single('avatar'),async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (err, req, res, next) => {
    res.status(400).send({ error : err.message })
})

//Route to fetch profile pic
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-type','image/jpg')
        res.send(user.avatar)
    } catch (err) {
        res.status(404).send()
    }
})

// Route to delete profile pic
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//Route to update user info **
router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email','password','age']
    const isValidOperatioin = updates.every((update) => allowedUpdates.includes(update))
    
    if(!isValidOperatioin){
        return res.status(400).send({ error : 'Invalid Updates'})
    }
    
    try {
        const user = req.user

        updates.forEach((update) => user[update] = req.body[update])                    //user[update] is syntax for dynamically writing user.property as we 
        await user.save()                                                               //can't use user.property as we explicitly don't know the name of the property which is being updated
        
        res.send(user)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Route to logout user from current session **
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

//Route to logout user form all sessions or all devices **
router.post('/users/logoutAll', auth , async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Successfully logged out of all!!')
    } catch (err) {
        res.status(500).send()
    }
})

//Route to delete user profile **
router.delete('/users/me', auth , async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (err) {
        res.status(500).send(err)
    }
})



module.exports = router