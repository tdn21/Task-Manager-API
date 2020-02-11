const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')

const userSchema = mongoose.Schema({
    name :   { 
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
                
            }
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 8,
        trim : true,
        validate(value) {
            if(value.toLowerCase().includes("password")) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age : {
        type : Number,
        default : 0,
        validate(value) {
            if (value < 0 || value > 150) {
                throw new Error('Age must be a positive integer and less than 150')
            }
        }
    },
    avatar: {
        type : Buffer
    },
    tokens : [{
        token: {
            type : String,
            required : true
        }
    }]
},{
    timestamps : true
})

//Setup virtual field to make mongoose understand relationship between user and tasks collection
userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'author'
})

//generate authentication token
userSchema.methods.genAuthToken = async function() {
    const user = this
    const token = await jwt.sign({_id : user._id.toString()},"developedByTarun")
    
    user.tokens = user.tokens.concat({ token })
    await user.save()
    
    return token
}

//remove confidential information before sending response
userSchema.methods.toJSON = function () {
    const user = this 
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens

    return userObject
}

//Check if given email and password are valid credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

//Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ author: user._id })
    next()
})

const User = mongoose.model('User', userSchema)


module.exports = User
// export default User