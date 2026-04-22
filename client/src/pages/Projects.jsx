import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLink, Code } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get('projects');
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  const displayProjects = projects.length > 0 ? projects : [
    {
      _id: '1',
      title: 'CloudScale Pro',
      image: '/cloud_dashboard_project.png',
      techStack: ['React', 'Python', 'AWS'],
      liveLink: '#'
    },
    {
      _id: '2',
      title: 'Velo Commerce',
      image: '/ecommerce_mobile_project.png',
      techStack: ['Next.js', 'Stripe', 'Prisma'],
      liveLink: '#'
    }
  ];

  return (
    <div className="py-12 px-8">
      <div className="max-w-4xl mx-auto mb-16 text-left">
        <h2 className="text-4xl font-bold mb-4 tracking-tight text-white">Featured Projects</h2>
        <p className="text-white/50 text-base max-w-2xl leading-relaxed">
          A selection of fullstack applications built with modern frameworks and pixel-perfect attention to detail.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {displayProjects.map((project) => (
          <div key={project._id} className="group cursor-pointer">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-[#1a1a1a] border border-white/5 mb-6 group-hover:border-white/10 transition-all duration-300">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {project.liveLink && (
                 <a 
                  href={project.liveLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/10"
                >
                  <ExternalLink size={16} className="text-white" />
                </a>
              )}
            </div>
            
            <div className="px-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-white/90 group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                <ExternalLink size={14} className="text-white/30 group-hover:text-mac-green transition-colors" />
              </div>
              
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {project.techStack.map((tech) => (
                  <span key={tech} className="text-[10px] font-bold tracking-widest uppercase text-white/30 group-hover:text-white/50 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
