const mongoose = require('mongoose')
const validator = require('validator')


const User = mongoose.model('User', {
    name :   { 
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
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
    }
})


module.exports = User
// export default User

