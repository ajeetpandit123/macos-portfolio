require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Skill = require('./models/Skill');

const seed = async () => {
    try {
        await connectDB();
        
        // Create Admin User
        const adminExists = await User.findOne({ username: 'Ajeet' });
        if (!adminExists) {
            await User.create({
                username: 'Ajeet',
                password: 'Ajeet@1902' // Updated credentials
            });
            console.log('Admin user created successfully (Ajeet/Ajeet@1902)');
        }

        // Create Initial Profile
        const profileExists = await Profile.findOne();
        if (!profileExists) {
            await Profile.create({
                name: 'Antigravity Developer',
                role: 'Full Stack AI Engineer',
                intro: 'Building the future with intelligent code and premium designs.',
                about: 'I am a passionate developer with expertise in modern web technologies. I love creating beautiful user interfaces and robust backend systems.',
                socialLinks: {
                    github: 'github.com',
                    linkedin: 'linkedin.com',
                    email: 'hello@example.com'
                }
            });
            console.log('Initial profile created');
        }

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
