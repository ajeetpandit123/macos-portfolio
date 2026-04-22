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
        if (!profile || !profile.resumeUrl) return res.status(404).json({ message: 'Resume not found' });
        
        const { cloudinary } = require('../config/cloudinary');
        
        // Extract public_id and resource_type from Cloudinary URL
        const urlParts = profile.resumeUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        let publicIdWithExt = '';
        let resourceType = 'image';

        if (uploadIndex !== -1) {
            if (urlParts.includes('raw')) resourceType = 'raw';
            let startIndex = uploadIndex + 1;
            if (urlParts[startIndex].startsWith('v')) startIndex++;
            publicIdWithExt = urlParts.slice(startIndex).join('/');
        }

        const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.')) || publicIdWithExt;

        // Use the dedicated private_download_url for more robust signed downloads
        const downloadUrl = cloudinary.utils.private_download_url(publicId, 'pdf', {
            resource_type: resourceType,
            attachment: true,
            expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiry
        });

        console.log('🔗 Generated Private Download URL:', downloadUrl);
        res.redirect(downloadUrl);
    } catch (error) {
        console.error('Download Proxy Error:', error);
        res.status(500).json({ message: 'Failed to download resume' });
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
                
                // VALIDATION: Check if new resume is same as old one
                if (currentProfile && currentProfile.resumeUrl) {
                    try {
                        // Extract public_id of old resume
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

                        // Fetch old resource to get its ETag (hash)
                        const oldResource = await cloudinary.api.resource(oldPublicId, { resource_type: oldResType });
                        
                        // CloudinaryStorage provides the 'etag' in the multer file object for some versions, 
                        // but if not, we can fetch the new resource info.
                        const newResource = await cloudinary.api.resource(newResume.filename, { resource_type: newResume.resource_type || 'raw' });

                        if (oldResource.etag === newResource.etag) {
                            // Delete the duplicate upload
                            await cloudinary.uploader.destroy(newResume.filename, { resource_type: newResume.resource_type || 'raw' });
                            return res.status(400).json({ 
                                message: 'The uploaded resume is identical to the one currently on file. No changes made.' 
                            });
                        }
                    } catch (err) {
                        console.log('Validation check skipped:', err.message);
                    }
                }

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
