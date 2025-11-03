import dotenv from 'dotenv'
import connectionDB from "./db/index.js";

// Config DotEnv

dotenv.config({
    path : './.env'
})

// Connect to Database
connectionDB()
.then(()=>{
    port = process.env.PORT || 3000
    app.on((err)=>{
        console.error("ERROR : in app" , err)
    }) 
    app.listen(port , ()=>{
        console.log(`Server is stared listing at port ${port}`)
    })
})
.catch((err)=>{
    console.error("Error in connection with mongoDB!!! ")
})