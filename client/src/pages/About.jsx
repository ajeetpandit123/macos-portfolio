import React, { useEffect, useState } from 'react';
import axios from 'axios';

const About = () => {
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
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">About Me</h2>
      <div className="prose prose-invert">
        <p className="text-white/70 leading-relaxed mb-6 whitespace-pre-line">
          {profile?.about || 'I’m a passionate Fullstack Engineer who enjoys building scalable, user-friendly web applications from end to end. I work comfortably across both frontend and backend, turning ideas into complete, functional products..'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-12">
        <div>
          <h3 className="text-xl font-semibold mb-4">Education</h3>
          <div className="space-y-4">
            <div className="border-l-2 border-mac-green pl-4">
              <h4 className="font-medium text-mac-green">Electronics and Communication Engineering</h4>
              <p className="text-sm text-white/50">Bihar Engineering University • 2021 - 2025</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Experience</h3>
          <div className="space-y-4">
            <div className="border-l-2 border-mac-yellow pl-4">
              <h4 className="font-medium text-mac-yellow">Fullstack Engineer</h4>
              <p className="text-sm text-white/50">Fine soft technology • may-2025 - jan-2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
