const multer = require("multer");
const { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require("../config");

// Set storage engine for users
const userstorage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error("Only images are allowed"), false);
  } else {
    cb(null, true);
  }
};

// Initialize upload
const uploadUserImage = multer({
  storage: userstorage,
  limits: { fileSize: MAX_FILE_SIZE }, // Limit file size to 1MB
  fileFilter: fileFilter,
});

module.exports = {
  uploadUserImage,
};
