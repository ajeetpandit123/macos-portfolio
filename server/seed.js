require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Skill = require('./models/Skill');

const seed = async () => {
    try {
        await connectDB();
        
        // Sync Admin User
        const admin = await User.findOne({ username: 'Ajeet' });
        if (!admin) {
            await User.create({
                username: 'Ajeet',
                password: 'Ajeet@1902'
            });
            console.log('Admin user created (Ajeet/Ajeet@1902)');
        } else {
            admin.password = 'Ajeet@1902';
            await admin.save();
            console.log('Admin password synchronized (Ajeet/Ajeet@1902)');
        }

        // Create or Update Profile
        await Profile.findOneAndUpdate(
            {}, 
            {
                name: 'Ajeet Kumar Pandit',
                role: 'Fullstack Engineer',
                intro: 'Building the future with intelligent code and premium designs.',
                about: 'I am a passionate developer with expertise in modern web technologies. I love creating beautiful user interfaces and robust backend systems.',
                socialLinks: {
                    github: 'https://github.com/ajeetpandit123',
                    linkedin: 'https://www.linkedin.com/in/ajeet-kumar-pandit-45b265373/',
                    whatsapp: '9546936532',
                    email: 'kumarajeet19022004@gmail.com'
                }
            },
            { upsert: true, new: true }
        );
        console.log('Profile synchronized');

        // Sync Skills (Replace existing to match user's new list)
        console.log('Syncing technical proficiencies...');
        await Skill.deleteMany({});
        
        const skillsData = [
            // Frontend
            { name: 'HTML', category: 'Frontend', proficiency: 98 },
            { name: 'CSS', category: 'Frontend', proficiency: 95 },
            { name: 'JavaScript', category: 'Frontend', proficiency: 95 },
            { name: 'React.js', category: 'Frontend', proficiency: 92 },
            { name: 'Next.js', category: 'Frontend', proficiency: 88 },
            { name: 'TypeScript', category: 'Frontend', proficiency: 85 },
            
            // Backend
            { name: 'Node.js', category: 'Backend', proficiency: 90 },
            { name: 'Express.js', category: 'Backend', proficiency: 90 },
            { name: 'MongoDB', category: 'Backend', proficiency: 85 },
            { name: 'MySQL', category: 'Backend', proficiency: 82 },
            { name: 'PHP', category: 'Backend', proficiency: 80 },
            { name: 'Laravel', category: 'Backend', proficiency: 75 },
            { name: 'Supabase', category: 'Backend', proficiency: 85 },
            { name: 'Appwrite', category: 'Backend', proficiency: 80 },
            
            // Tools
            { name: 'Antigravity', category: 'Tools', proficiency: 100 },
            { name: 'Cursor', category: 'Tools', proficiency: 95 },
            { name: 'Replit', category: 'Tools', proficiency: 90 },
            { name: 'Netlify', category: 'Tools', proficiency: 92 },
            { name: 'Vercel', category: 'Tools', proficiency: 92 },
            { name: 'AWS', category: 'Tools', proficiency: 70 },
            
            // Other
            { name: 'Git & GitHub', category: 'Other', proficiency: 95 },
            { name: 'REST API Integration', category: 'Other', proficiency: 92 },
            { name: 'Authentication (JWT, OAuth)', category: 'Other', proficiency: 88 },
            { name: 'Responsive Web Design', category: 'Other', proficiency: 95 },
            { name: 'UI/UX Principles', category: 'Other', proficiency: 80 },
            { name: 'Deployment & CI/CD', category: 'Other', proficiency: 75 },
            { name: 'Debugging & Optimization', category: 'Other', proficiency: 85 },
            { name: 'Basic DevOps Concepts', category: 'Other', proficiency: 70 },
            { name: 'Problem Solving & DSA', category: 'Other', proficiency: 75 },
            { name: 'Agile/Scrum Workflow', category: 'Other', proficiency: 80 }
        ];

        await Skill.insertMany(skillsData);
        console.log('✅ Skills synchronized successfully');

        console.log('Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();
