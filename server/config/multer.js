const multer = require('multer');
const path = require('path');

// Multer setup using Memory Storage for direct cloud upload
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedExtensions = new Set(['.pdf', '.doc', '.docx']);
        const allowedMimeTypes = new Set([
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]);
        const extname = allowedExtensions.has(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedMimeTypes.has(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Resumes only (PDF, DOC, DOCX)!');
        }
    }
});

module.exports = upload;
