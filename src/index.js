import dotenv from 'dotenv'
import connectionDB from "./db/index.js";

// Config DotEnv

dotenv.config({
    path : './.env'
})

// Connect to Database

connectionDB()