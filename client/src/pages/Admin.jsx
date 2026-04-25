import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Plus, Trash, Image as ImageIcon, FileText, 
  User, Briefcase, Code, MessageSquare, LogOut 
} from 'lucide-react';
import Login from './Login'; // Added missing import

const Admin = ({ isLoggedIn, setIsLoggedIn, onProfileUpdate }) => {
  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  const [activeSubTab, setActiveSubTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState({ name: '', role: '', about: '', intro: '' });
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    if (setIsLoggedIn) setIsLoggedIn(false);
  };

  // New Project State
  const [newProject, setNewProject] = useState({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: null });

  // New Skill State
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend', proficiency: 90 });

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const fetchData = async () => {
    try {
      if (activeSubTab === 'projects') {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setProjects(data || []);
      } else if (activeSubTab === 'skills') {
        const { data, error } = await supabase.from('skills').select('*').order('name');
        if (error) throw error;
        setSkills(data || []);
      } else if (activeSubTab === 'messages') {
        const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setMessages(data || []);
      } else if (activeSubTab === 'profile') {
        const { data, error } = await supabase.from('profiles').select('*').single();
        if (error) throw error;
        if (data) setProfile(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      // Fallback to axios for existing data
      try {
        const { data } = await axios.get(activeSubTab);
        if (activeSubTab === 'projects') setProjects(data);
        else if (activeSubTab === 'skills') setSkills(data);
        else if (activeSubTab === 'messages') setMessages(data);
        else if (activeSubTab === 'profile' && data) setProfile(data);
      } catch (axErr) {}
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = '';
      if (newProject.image) {
        const fileExt = newProject.image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('portfolio-assets')
          .upload(`projects/${fileName}`, newProject.image);
        
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('portfolio-assets').getPublicUrl(`projects/${fileName}`);
        imageUrl = publicUrl;
      }

      const { error } = await supabase.from('projects').insert([{
        title: newProject.title,
        description: newProject.description,
        tech_stack: newProject.techStack.split(',').map(s => s.trim()),
        github_link: newProject.githubLink,
        live_link: newProject.liveLink,
        image: imageUrl || '/cloud_dashboard_project.png'
      }]);

      if (error) throw error;
      toast.success('Project created!');
      setNewProject({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: null });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      toast.success('Project deleted');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete project');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let updates = {
        name: profile.name,
        role: profile.role,
        intro: profile.intro,
        about: profile.about,
      };

      if (profile.newImage) {
        const fileExt = profile.newImage.name.split('.').pop();
        const fileName = `avatar-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('portfolio-assets')
          .upload(`profile/${fileName}`, profile.newImage);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('portfolio-assets').getPublicUrl(`profile/${fileName}`);
        updates.profile_image = publicUrl;
      }

      if (profile.newResume) {
        const { error: uploadError } = await supabase.storage
          .from('portfolio-assets')
          .upload(`resumes/Resume-${Date.now()}.pdf`, profile.newResume);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('portfolio-assets').getPublicUrl(`resumes/Resume-${Date.now()}.pdf`);
        updates.resume_url = publicUrl;
      }

      const { error } = await supabase.from('profiles').update(updates).eq('id', profile.id || 1); // Assuming ID 1 or handled by RLS
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
      fetchData();
      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('skills').insert([newSkill]);
      if (error) throw error;
      toast.success('Skill added!');
      setNewSkill({ name: '', category: 'Frontend', proficiency: 90 });
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      toast.success('Skill deleted');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete skill');
    }
  };

  const menuItems = [
    { id: 'projects', icon: Briefcase, label: 'Projects' },
    { id: 'skills', icon: Code, label: 'Skills' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
  ];

  return (
    <div className="flex h-full min-h-[500px]">
      <div className="w-48 border-r border-white/10 pr-6 flex flex-col">
        <div className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeSubTab === item.id ? 'bg-mac-green text-black font-bold' : 'hover:bg-white/5 text-white/60'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 mt-auto rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="flex-1 pl-8 overflow-y-auto">
        {activeSubTab === 'projects' && (
          <div className="space-y-8">
            <h3 className="text-xl font-bold">Manage Projects</h3>
            <form onSubmit={handleCreateProject} className="glass p-6 rounded-xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Project Title" required className="bg-black/20 border border-white/10 p-2 rounded-lg outline-none focus:border-mac-green" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} />
                <input type="text" placeholder="Tech Stack (comma separated)" className="bg-black/20 border border-white/10 p-2 rounded-lg outline-none focus:border-mac-green" value={newProject.techStack} onChange={(e) => setNewProject({...newProject, techStack: e.target.value})} />
              </div>
              <textarea placeholder="Description" required className="w-full bg-black/20 border border-white/10 p-2 rounded-lg outline-none focus:border-mac-green h-20" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="url" placeholder="Github Link" className="bg-black/20 border border-white/10 p-2 rounded-lg outline-none focus:border-mac-green" value={newProject.githubLink} onChange={(e) => setNewProject({...newProject, githubLink: e.target.value})} />
                <input type="url" placeholder="Live Link" className="bg-black/20 border border-white/10 p-2 rounded-lg outline-none focus:border-mac-green" value={newProject.liveLink} onChange={(e) => setNewProject({...newProject, liveLink: e.target.value})} />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex-1 glass p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  <ImageIcon size={18} />
                  {newProject.image ? newProject.image.name : 'Choose Project Image'}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setNewProject({...newProject, image: e.target.files[0]})} />
                </label>
                <button type="submit" disabled={loading} className="px-8 py-2 bg-mac-green text-black font-bold rounded-lg hover:bg-mac-green/90 transition-all">
                  {loading ? 'Adding...' : 'Add Project'}
                </button>
              </div>
            </form>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id || project._id} className="flex items-center justify-between glass p-4 rounded-xl">
                  <div className="flex items-center gap-4">
                    <img src={project.image} alt="" className="w-12 h-12 rounded object-cover" />
                    <div>
                      <h4 className="font-bold">{project.title}</h4>
                      <p className="text-xs text-white/50">{project.techStack.join(', ')}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteProject(project.id || project._id)} className="p-2 text-mac-red hover:bg-mac-red/10 rounded-lg transition-colors">
                    <Trash size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'profile' && (
          <div className="space-y-8 max-w-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Profile Info</h3>
              {profile.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-mac-green hover:underline">View Current Resume →</a>}
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-white/40 ml-1">Profile Image</label>
                  <label className="w-full glass p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-2 overflow-hidden">
                    <ImageIcon size={18} />
                    <span className="text-sm truncate">{profile.newImage ? profile.newImage.name : 'Change Photo'}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setProfile({...profile, newImage: e.target.files[0]})} />
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/40 ml-1">Resume (PDF)</label>
                  <label className="w-full glass p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-2 overflow-hidden">
                    <FileText size={18} />
                    <span className="text-sm truncate">{profile.newResume ? profile.newResume.name : 'Upload PDF'}</span>
                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => setProfile({...profile, newResume: e.target.files[0]})} />
                  </label>
                </div>
              </div>
              <input type="text" placeholder="Name" className="w-full glass p-3 rounded-lg outline-none focus:border-mac-green" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
              <input type="text" placeholder="Role" className="w-full glass p-3 rounded-lg outline-none focus:border-mac-green" value={profile.role} onChange={(e) => setProfile({...profile, role: e.target.value})} />
              <input type="text" placeholder="Short Intro" className="w-full glass p-3 rounded-lg outline-none focus:border-mac-green" value={profile.intro} onChange={(e) => setProfile({...profile, intro: e.target.value})} />
              <textarea placeholder="About Me" rows={5} className="w-full glass p-3 rounded-lg outline-none focus:border-mac-green resize-none" value={profile.about} onChange={(e) => setProfile({...profile, about: e.target.value})} />
              <button type="submit" disabled={loading} className="w-full py-3 bg-mac-green text-black font-bold rounded-lg hover:bg-mac-green/90 transition-all">{loading ? 'Saving...' : 'Save Changes'}</button>
            </form>
          </div>
        )}

        {activeSubTab === 'messages' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Inbound Messages</h3>
            {messages.map((m) => (
              <div key={m._id} className="glass p-4 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-mac-green">{m.name}</span>
                  <span className="text-xs text-white/30">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-white/50">{m.email} - {m.subject}</p>
                <p className="text-sm text-white/80">{m.message}</p>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'skills' && (
          <div className="space-y-8">
            <h3 className="text-xl font-bold">Manage Skills</h3>
            <form onSubmit={handleCreateSkill} className="glass p-6 rounded-xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Skill Name (e.g. Antigravity)" 
                  required 
                  className="bg-black/20 border border-white/10 p-2 rounded-lg outline-none focus:border-mac-green text-white" 
                  value={newSkill.name} 
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} 
                />
                <select 
                  className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg outline-none focus:border-mac-green text-white"
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Tools">Tools</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full py-2 bg-mac-green text-black font-bold rounded-lg hover:bg-mac-green/90 transition-all">
                {loading ? 'Adding...' : 'Add Skill'}
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div key={skill.id || skill._id} className="flex items-center justify-between glass p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      skill.category === 'Frontend' ? 'bg-[#27c93f]' : 
                      skill.category === 'Backend' ? 'bg-[#ffbd2e]' : 
                      skill.category === 'Tools' ? 'bg-[#ff5f56]' : 'bg-blue-400'
                    }`} />
                    <div>
                      <h4 className="font-bold text-sm">{skill.name}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{skill.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleDeleteSkill(skill.id || skill._id)} className="p-2 text-mac-red hover:bg-mac-red/10 rounded-lg transition-colors">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
