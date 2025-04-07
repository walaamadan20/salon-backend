const {Schema, model} = require("mongoose")

const servicesSchema = new Schema({
    username: {
        type: String,
        required:[true,"Email is Required"],
        unique:true,
        lowercase:true,
        trim:true
    },
    hashedPassword:{
        type:String,
        required:[true,"Password is Required"]
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
})

const Services = model("Services",servicesSchema)

module.exports = Services