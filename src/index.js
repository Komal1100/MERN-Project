import dotenv from 'dotenv'
import connectionDB from "./db/index.js";
import { app } from './app.js';

// Config DotEnv

dotenv.config({
    path : './.env'
})

// Connect to Database
connectionDB()
.then(()=>{
    const port = process.env.PORT || 3000 ;
    app.on('error',(err)=>{
        console.error("ERROR : in app" , err)
    }) 
    app.listen(port , ()=>{
        console.log(`Server is stared listing at port ${port}`)
    })
})
.catch((err)=>{
    console.error("Error in connection with mongoDB!!! " ,  err)
})