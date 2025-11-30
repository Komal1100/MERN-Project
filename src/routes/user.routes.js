import { Router } from "express";
import { login, logout, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import {uploadMulter} from "../middlewares/multer.middleware.js"
import { verifyUser } from "../middlewares/auth.middlerware.js"

const router = Router()

router.route("/register").post(
    // middleware
    uploadMulter.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)

router.route("/login").post(login)

router.route("/logout").post(verifyUser , logout)

router.route("/refresh-token").post(refreshAccessToken)

export default router

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTI2NDgxYWE1NWYzNDhhY2MwM2Q0ZmQiLCJlbWFpbCI6ImFiY0BnbWFpbC5jb20iLCJ1c2VyTmFtZSI6ImtvbWFsIiwiZnVsbE5hbWUiOiJLb21hbCBHYW5nYW5pIiwiaWF0IjoxNzY0NDc5MjI0LCJleHAiOjE3NjQ1NjU2MjR9.1RYzE8IB7c7ceGa5My1i207NdIRpYo9x_QKI3QWAdW0