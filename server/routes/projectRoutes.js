const express = require('express');
const router = express.Router();
const { getProjects, createProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getProjects);
// Modified route to handle Multer errors
router.post('/', protect, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('❌ MULTER ERROR:', err);
            return res.status(400).json({ message: 'File upload error: ' + err.message });
        }
        next();
    });
}, createProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
