const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProject = async (req, res) => {
    console.log('📬 NEW PROJECT REQUEST:');
    console.log('Body:', req.body);
    console.log('File:', req.file ? 'Received' : 'MISSING');

    try {
        const { title, description, techStack, githubLink, liveLink } = req.body;
        
        if (!req.file) {
            console.log('❌ Rejection: No image file in request.');
            return res.status(400).json({ message: 'Project image is required! Please select an image.' });
        }

        const image = req.file.path;
        
        const project = await Project.create({
            title,
            description,
            techStack: techStack ? JSON.parse(techStack) : [],
            githubLink,
            liveLink,
            image
        });
        console.log('✅ Project created successfully in DB');
        res.status(201).json(project);
    } catch (error) {
        console.error('❌ PROJECT CREATION FAILED!');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        if (error.errors) {
            console.error('Validation Errors:', Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`));
        }
        console.error('Stack Trace:', error.stack);
        res.status(400).json({ message: 'Database/Upload Error: ' + error.message });
    }
};

const cloudinary = require('cloudinary').v2;

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Delete image from Cloudinary
        // Cloudinary URL format: .../upload/v12345/folder/filename.jpg
        const publicId = 'portfolio/' + project.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ message: error.message });
    }
};
