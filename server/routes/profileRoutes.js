const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', async (req, res) => {
    try {
        const profile = await Profile.findOne();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/download-resume', async (req, res) => {
    try {
        const profile = await Profile.findOne();
        if (!profile || !profile.resumeUrl) {
            return res.status(404).json({ message: 'No resume uploaded yet.' });
        }

        const axios = require('axios');

        // Stream the file from Cloudinary directly to the client
        const response = await axios({
            method: 'GET',
            url: profile.resumeUrl,
            responseType: 'stream',
        });

        res.setHeader('Content-Disposition', 'attachment; filename="Ajeet_Resume.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        response.data.pipe(res);
    } catch (error) {
        console.error('Download Proxy Error:', error.message);
        res.status(500).json({ message: 'Failed to download resume: ' + error.message });
    }
});

router.post('/', protect, upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), async (req, res) => {
    try {
        const { cloudinary } = require('../config/cloudinary');
        const profileData = { ...req.body };
        const currentProfile = await Profile.findOne();
        
        if (req.files) {
            if (req.files.profileImage) {
                profileData.profileImage = req.files.profileImage[0].path;
            }
            
            if (req.files.resume) {
                const newResume = req.files.resume[0];
                
                /* 
                // TEMPORARILY DISABLED TO ALLOW FIXING PREVIEW TYPE
                if (currentProfile && currentProfile.resumeUrl) {
                    try {
                        const oldUrl = currentProfile.resumeUrl;
                        const oldParts = oldUrl.split('/');
                        const oldUploadIdx = oldParts.indexOf('upload');
                        let oldIdWithExt = '';
                        let oldResType = 'image';
                        if (oldUploadIdx !== -1) {
                            if (oldParts.includes('raw')) oldResType = 'raw';
                            let sIdx = oldUploadIdx + 1;
                            if (oldParts[sIdx].startsWith('v')) sIdx++;
                            oldIdWithExt = oldParts.slice(sIdx).join('/');
                        }
                        const oldPublicId = oldIdWithExt.substring(0, oldIdWithExt.lastIndexOf('.')) || oldIdWithExt;

                        const oldResource = await cloudinary.api.resource(oldPublicId, { resource_type: oldResType });
                        const newResource = await cloudinary.api.resource(newResume.filename, { resource_type: newResume.resource_type || 'image' });

                        if (oldResource.etag === newResource.etag && oldResource.resource_type === newResource.resource_type) {
                            await cloudinary.uploader.destroy(newResume.filename, { resource_type: newResume.resource_type || 'image' });
                            return res.status(400).json({ 
                                message: 'This exact resume (and file type) is already on file. No changes needed.' 
                            });
                        }
                    } catch (err) {
                        console.log('Duplicate check skipped:', err.message);
                    }
                }
                */

                profileData.resumeUrl = newResume.path;
            }
        }

        let profile = currentProfile;
        if (profile) {
            profile = await Profile.findByIdAndUpdate(profile._id, profileData, { new: true });
        } else {
            profile = await Profile.create(profileData);
        }
        res.json(profile);
    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
