require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const taskRoutes =require('./routes/task');


const app = express();
const port   = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());


async function start(){
    try{
        await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    app.use('/api/tasks', taskRoutes);

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    }
    catch(err){
        console.error("Error starting server:", err);
        process.exit(1);
}
}
start();