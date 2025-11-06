import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const fileUploadCloudinary = async (localpath) => {
    try {
        const response = await cloudinary.uploader
            .upload(localpath,
                {
                    resource_type: "auto",
                    // resource_type: "video", public_id: "my_dog", overwrite: true, notification_url: "https://mysite.example.com/notify_endpoint"})
                }
            )
        console.log(`File is succesfully uploaded at ${response.url}`)
        // if (fs.existsSync(localpath)) fs.unlinkSync(localpath);
        return response
    } catch (error) {
        // Incase of fail to upload file on cloudinary remove localy saved temp file
        if (fs.existsSync(localpath)) fs.unlinkSync(localpath);
        console.error("Cloudinary upload failed:", error.message || error);
        return null;
    }

}

cloudinary.config({
    cloud_name: process.env.FILE_UPLOAD_CLOUD_NAME,
    api_key: process.env.FILE_UPLOAD_API_KEY,
    api_secret: process.env.FILE_UPLOAD_API_SECRET
})

export { fileUploadCloudinary }

