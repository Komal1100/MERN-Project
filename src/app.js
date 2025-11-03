import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

// CORS setup
app.use(cors(
    {
        origin : process.env.CORS_ORIGIN,
        credentials : true
    }
))

// For Set-up JSON Input limit
app.use(express.json({limit: "16kb"}))

// For Set-up URL Input
app.use(express.urlencoded({extended : true , limit : "16kb"}))

// For Store Assests Statically in Sereve "public" Folder
app.use(express.static("public"))

// For CRUD Operation of Cookie
app.use(cookieParser())

export {app}
