const express = require('express');
const cors = require('cors');


const app = express();
const port   = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());


async function start(){
    try{
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