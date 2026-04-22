import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Home = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('profile');
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-10">
      <motion.img
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        src={profile?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
        alt="Profile"
        className="w-32 h-32 rounded-full border-4 border-white/10 shadow-xl mb-6 object-cover"
      />
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-bold mb-2"
      >
        {profile?.name || 'Ajeet Kumar Pandit'}
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-white/70 mb-6"
      >
        {profile?.role || 'Full Stack Developer'}
      </motion.p>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-md text-white/50 mb-8"
      >
        {profile?.intro || 'Passionate about building beautiful, functional, and user-centric web applications.'}
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4"
      >
        <a
          href={`${axios.defaults.baseURL}profile/download-resume`}
          download="Resume.pdf"
          className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
        >
          Download Resume
        </a>
        <button className="px-6 py-2 glass rounded-lg font-medium hover:bg-white/10 transition-colors cursor-pointer">
          Let's Talk
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
