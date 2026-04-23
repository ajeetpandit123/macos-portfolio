import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Camera, Mail, User, Briefcase, FileText, Globe, ShieldCheck, MessageSquare } from 'lucide-react';
import Login from './Login';

const Profile = ({ isLoggedIn, setIsLoggedIn, onProfileUpdate }) => {
  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  const [profile, setProfile] = useState({ 
    name: '', 
    role: '', 
    about: '', 
    intro: '',
    socialLinks: { github: '', linkedin: '', whatsapp: '', email: '' }
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('profile');
      if (data) {
        setProfile({
          ...data,
          socialLinks: data.socialLinks || { github: '', linkedin: '', whatsapp: '', email: '' }
        });
        setPreviewImage(data.profileImage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, newImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('role', profile.role);
    formData.append('intro', profile.intro);
    formData.append('about', profile.about);
    formData.append('socialLinks', JSON.stringify(profile.socialLinks));
    if (profile.newImage) formData.append('profileImage', profile.newImage);
    if (profile.newResume) formData.append('resume', profile.newResume);

    try {
      const { data } = await axios.post('profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(data);
      if (onProfileUpdate) onProfileUpdate();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden bg-white/5 shadow-2xl relative">
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">
                <User size={64} />
              </div>
            )}
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="text-white" size={24} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-mac-green rounded-full p-1.5 border-4 border-[#1e1e1e] shadow-lg">
            <ShieldCheck size={16} className="text-black" />
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{profile.name || 'Set Your Name'}</h2>
          <p className="text-white/40 text-sm">{profile.role || 'Set Your Role'}</p>
        </div>
      </div>

      <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-white/30 uppercase tracking-wider ml-1">Personal Info</label>
            <div className="space-y-3">
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-mac-green/50 transition-colors" 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})} 
                />
              </div>
              <div className="relative">
                <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Professional Role" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-mac-green/50 transition-colors" 
                  value={profile.role} 
                  onChange={(e) => setProfile({...profile, role: e.target.value})} 
                />
              </div>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Short Intro (Tagline)" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-mac-green/50 transition-colors" 
                  value={profile.intro} 
                  onChange={(e) => setProfile({...profile, intro: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-white/30 uppercase tracking-wider ml-1">Social Links</label>
            <div className="space-y-3">
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="GitHub URL" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-mac-green/50 transition-colors" 
                  value={profile.socialLinks?.github} 
                  onChange={(e) => setProfile({...profile, socialLinks: {...profile.socialLinks, github: e.target.value}})} 
                />
              </div>
              <div className="relative">
                <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="LinkedIn URL" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-mac-green/50 transition-colors" 
                  value={profile.socialLinks?.linkedin} 
                  onChange={(e) => setProfile({...profile, socialLinks: {...profile.socialLinks, linkedin: e.target.value}})} 
                />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="email" 
                  placeholder="Gmail Address" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-mac-green/50 transition-colors" 
                  value={profile.socialLinks?.email} 
                  onChange={(e) => setProfile({...profile, socialLinks: {...profile.socialLinks, email: e.target.value}})} 
                />
              </div>
              <div className="relative">
                <MessageSquare size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="WhatsApp Number (e.g. 919876543210)" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-mac-green/50 transition-colors" 
                  value={profile.socialLinks?.whatsapp} 
                  onChange={(e) => setProfile({...profile, socialLinks: {...profile.socialLinks, whatsapp: e.target.value}})} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-white/30 uppercase tracking-wider ml-1">Documents</label>
            <div className="relative">
              <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <label className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm text-white/60 cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-2">
                <span className="truncate flex-1">{profile.newResume ? profile.newResume.name : 'Update Resume (PDF)'}</span>
                <input type="file" className="hidden" accept=".pdf" onChange={(e) => setProfile({...profile, newResume: e.target.files[0]})} />
              </label>
            </div>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-[10px] text-mac-green/60 hover:text-mac-green transition-colors ml-1">
                View current resume →
              </a>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2 h-full flex flex-col">
            <label className="text-[11px] font-semibold text-white/30 uppercase tracking-wider ml-1">Bio / About Me</label>
            <textarea 
              placeholder="Tell your story..." 
              className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-mac-green/50 transition-colors resize-none min-h-[200px]" 
              value={profile.about} 
              onChange={(e) => setProfile({...profile, about: e.target.value})} 
            />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-start gap-4 pt-8 border-t border-white/10 mb-10">
          <button 
            type="button" 
            onClick={fetchProfile}
            className="px-6 py-2 rounded-lg text-sm text-white/60 hover:text-white transition-colors"
          >
            Reset
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-2 bg-mac-green text-black font-bold rounded-lg hover:bg-mac-green/90 transition-all shadow-lg shadow-mac-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
