const express = require('express')
const Task = require('../models/tasks')

const router = express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    } catch(err) {
        res.status(400).send(err)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (err) {
        res.send(err)
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send(`${_id} is not a valid task_id`)  
      }

    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send('Task not found')
        }
        res.send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    try {
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
        
        const task = await Task.findByIdAndUpdate(_id, req.body, {new : true, runValidators : true})

        if(!task) {
            return res.status(404).send('task not found')
        }
        res.send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send(`${_id} is not a valid task_id`)  
      }

    try {
        const task = await Task.findByIdAndDelete(_id)
    
        if(!task) {
            return res.status(404).send('Task not found!')
        }
        res.send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router