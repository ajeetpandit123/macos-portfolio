import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Skills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await axios.get('skills');
        setSkills(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSkills();
  }, []);

  const categories = ['Frontend', 'Backend', 'Tools', 'Other'];
  
  const fallbackSkills = [
    { name: 'HTML', category: 'Frontend', proficiency: 98 },
    { name: 'CSS', category: 'Frontend', proficiency: 95 },
    { name: 'JavaScript', category: 'Frontend', proficiency: 95 },
    { name: 'React.js', category: 'Frontend', proficiency: 92 },
    { name: 'Next.js', category: 'Frontend', proficiency: 88 },
    { name: 'TypeScript', category: 'Frontend', proficiency: 85 },
    { name: 'Node.js', category: 'Backend', proficiency: 90 },
    { name: 'Express.js', category: 'Backend', proficiency: 90 },
    { name: 'MongoDB', category: 'Backend', proficiency: 85 },
    { name: 'MySQL', category: 'Backend', proficiency: 82 },
    { name: 'Git & GitHub', category: 'Other', proficiency: 95 },
    { name: 'REST API Integration', category: 'Other', proficiency: 92 },
    { name: 'Authentication (JWT, OAuth)', category: 'Other', proficiency: 88 },
    { name: 'Responsive Web Design', category: 'Other', proficiency: 95 },
    { name: 'UI/UX Principles', category: 'Other', proficiency: 80 },
    { name: 'Vercel', category: 'Tools', proficiency: 92 },
    { name: 'Netlify', category: 'Tools', proficiency: 92 },
    { name: 'Deployment & CI/CD', category: 'Other', proficiency: 75 }
  ];

  const displaySkills = skills.length > 0 ? skills : fallbackSkills;

  return (
    <div className="py-12 px-8 max-w-5xl mx-auto">
      <div className="text-left mb-16">
        <h2 className="text-4xl font-bold mb-4 tracking-tight text-white">Technical Proficiency</h2>
        <p className="text-white/50 text-base max-w-2xl leading-relaxed">
          A comprehensive overview of my technical stack and the tools I use to build modern digital experiences.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {categories.map((cat) => {
          const catColor = 
            cat === 'Frontend' ? 'text-[#27c93f]' : 
            cat === 'Backend' ? 'text-[#ffbd2e]' : 
            cat === 'Tools' ? 'text-[#ff5f56]' : 'text-blue-400';
          const catBg = 
            cat === 'Frontend' ? 'bg-[#27c93f]/10' : 
            cat === 'Backend' ? 'bg-[#ffbd2e]/10' : 
            cat === 'Tools' ? 'bg-[#ff5f56]/10' : 'bg-blue-400/10';

          return (
            <div key={cat} className="space-y-6">
              <h3 className={`text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-3 ${catColor}`}>
                <span className={`w-2 h-2 rounded-full ${catColor.replace('text-', 'bg-')}`} />
                {cat}
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {displaySkills.filter(s => s.category === cat).map((skill) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    className="px-4 py-2 rounded-full glass border border-white/5 text-sm font-medium text-white/80 transition-all cursor-default"
                  >
                    {skill.name}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Skills;
