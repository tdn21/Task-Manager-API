const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = mongoose.Schema({
    description : {
        type : String,
        required : true,
        trim : true
    },
   
    completed : {
        type : Boolean,
        default : false,

    }
})


const Tasks = mongoose.model('Tasks',taskSchema)


module.exports = Tasks