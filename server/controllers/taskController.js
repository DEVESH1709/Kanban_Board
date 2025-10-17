const Task = require('../models/Task');

async function getAllTasks(req,res){
    try{
        const tasks = await Task.find();
        return res.json(tasks);
    
    } catch(err){
        return res.status(500).json({error: err.message|| err});

    }
}

async function createTask(req,res){
    try{
        const {title,status}= req.body;
        const task = new Task({title,status})
        const saved = await task.save();
        return res.status(201).json(saved);
    }
    catch(err){
        return res.status(500).json({error:err.message || err})
    }
}

async function updateTask(req,res){
    try{
        const {id} = req.params;
        const updated = await Task.findByIdAndUpdate(id,req.body,{new:true});
        if(!updated) return res.status(404).json({error: 'Task not found'});
        return res.json(updated);

    }catch(err){
        return res.status(500).json({error:err.message || err})
    }
}


async function deleteTask(req,res){
    try{
        const {id} = req.params;
        const deleted = await Task.findByIdAndDelete(id);
        if(!deleted) return res.status(404).json({error: 'Task not found'});
        return res.json({success:true});
    }
    catch(err){
        return res.status(400).json({error:err.message || err});
    
    }
}

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
};
