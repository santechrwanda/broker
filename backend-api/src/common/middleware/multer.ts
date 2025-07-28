import multer from "multer"
import path from "path"
import fs from "fs"
import type { Express } from "express"

// Ensure assets directory exists
const assetsDir = path.join(process.cwd(), "assets")
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, assetsDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const extension = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + extension)
  },
})

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed!"))
  }
}

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Middleware for single profile image upload
export const uploadProfileImage = upload.single("profile")

// Middleware for multiple file uploads (if needed in future)
export const uploadMultipleFiles = upload.array("files", 10)

export default upload
