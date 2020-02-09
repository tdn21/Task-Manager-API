const express = require('express')
const Task = require('../models/tasks')
const auth = require('../middlewares/auth')

const router = new express.Router()

//Authentication is required for every task route

//Route to create new task
router.post('/tasks',auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        author: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    } catch(err) {
        res.status(400).send(err)
    }
})

//Route to fetch all tasks of the authenticated user
router.get('/tasks',auth, async (req, res) => {
    try {
        const tasks = await Task.find({author : req.user._id})
        res.send(tasks)
    } catch (err) {
        res.send(err)
    }
})

//Route to fetch a particular task of authenticated user by its _id
router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id
    
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send(`${_id} is not a valid task_id`)  
      }

    try{
        const task = await Task.findOne({_id, author : req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})

//Route to update task by its _id(of authenticated user)
router.patch('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id
    
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send(`${_id} is not a valid task_id`)  
    }
    
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperatioin = updates.every((update) => allowedUpdates.includes(update))
    
    if(!isValidOperatioin){
        return res.status(400).send({ error : 'Invalid Updates'})
    }
    
    try {
        const task = await Task.findOne({_id, author : req.user._id})
        
        if(!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Route to delete a task by _id(of authenticated user)
router.delete('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id

    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send(`${_id} is not a valid task_id`)  
      }

    try {
        const task = await Task.findOneAndDelete({_id, author : req.user._id})
    
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})



module.exports = router