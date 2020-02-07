const express = require('express')
require('./db/mongoose.js')
const User = require('./models/user.js')
const Task = require('./models/tasks.js')

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())                                                 //to parse incoming json to an object

app.post('/users', (req,res) => {
    const user = new User(req.body)
    
    user.save().then(() => {
        res.status(201).send(user)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.get('/users/:id', (req,res) => {
    const _id = req.params.id
    
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send(`${_id} is not a valid user_id`)  
      }
    User.findById(_id).then((user) => {
        if(!user){
            return res.status(404).send('Task not found')
        }
        res.send(user)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send(`${_id} is not a valid task_id`)  
      }

    Task.findById(_id).then((task) => {
        if(!task){
            return res.status(404).send('Task not found')
        }
        res.send(task)
    }).catch((err) => {
        res.status(500).send(err)
    })
})


app.listen(port, () => console.log(`Server is up at port ${port}!`))


