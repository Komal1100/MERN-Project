import { Router } from "express";
import { changePassword, getCurrentUser, login, logout, refreshAccessToken, registerUser, updateUserAvatar, updateUserCoverImage, updateUserFields } from "../controllers/user.controller.js";
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

router.route("/curr-user").get(verifyUser , getCurrentUser)

router.route("/update-user-detail").patch(verifyUser, updateUserFields)

router.route("/update-user-avatar").patch(verifyUser,uploadMulter.single("avatar"),updateUserAvatar)

router.route("/update-user-coverimage").patch(verifyUser,uploadMulter.single("coverImage"), updateUserCoverImage)

router.route("/change-user-password").patch(verifyUser,changePassword)

export default router

