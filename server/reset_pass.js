require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function resetPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ username: 'Ajeet' });
        
        if (user) {
            user.password = 'Ajeet@1902';
            await user.save();
            console.log('✅ Success: Password for user "Ajeet" has been reset to "Ajeet@1902"');
        } else {
            await User.create({ username: 'Ajeet', password: 'Ajeet@1902' });
            console.log('✅ Success: Admin user "Ajeet" created with password "Ajeet@1902"');
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Error resetting password:', err.message);
        process.exit(1);
    }
}

resetPassword();
