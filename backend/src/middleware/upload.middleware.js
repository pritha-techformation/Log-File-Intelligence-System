// middleware/upload.middleware.js

// import multer
const multer = require("multer");

const upload = multer({
  // Set the storage destination for uploaded files to uploads folder
  dest: "uploads/",

  // Set the maximum file size to 5MB
  limits: { fileSize: 5 * 1024 * 1024 },

  // Set the file filter to only allow .txt files
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/plain") cb(null, true);
    else cb(new Error("Only .txt files allowed"));
  }
});

module.exports = upload;