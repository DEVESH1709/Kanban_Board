const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    title:{
        title:String, 
        required:true},
    status:{
        type:String,
        required:true,
    }
})

module.exports =  mongoose.model('Task',TaskSchema);