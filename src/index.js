const express = require('express')
require('./db/mongoose.js')
const User = require('./models/user.js')
const Task = require('./models/tasks.js')

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())                                                 //to parse incoming json to an object

app.post('/users', async (req,res) => {
    const user = new User(req.body)
    
    try{
        await user.save()
        res.status(201).send(user)
    } catch (err) {
        res.status(400).send(err)
    }
    
    // Refactored code from the below written promise chaining syntax to above written async await syntax
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((err) => {
    //     res.status(400).send(err)
    // })
})

app.get('/users', async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    } catch (err) {
        res.status(500).send(err)
    }
})

app.get('/users/:id', async (req,res) => {
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

app.patch('/users/:id', async (req, res) => {
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

app.delete('/users/:id', async (req, res) => {
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

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    } catch(err) {
        res.status(400).send(err)
    }
})

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (err) {
        res.send(err)
    }
})

app.get('/tasks/:id', async (req, res) => {
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

app.patch('/tasks/:id', async (req, res) => {
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

app.delete('/tasks/:id', async (req, res) => {
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



app.listen(port, () => console.log(`Server is up at port ${port}!`))