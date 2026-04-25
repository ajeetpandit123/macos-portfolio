import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Lock, User, ChevronLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast.success('Login successful!');
      if (onLogin) onLogin();
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto animate-in fade-in zoom-in duration-500">
      <div className="w-full flex justify-start mb-8">
        <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>
      </div>
      
      <div className="w-20 h-20 bg-mac-green rounded-[22%] flex items-center justify-center mb-8 shadow-2xl shadow-mac-green/20">
        <Lock className="text-black" size={32} />
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-white">Admin Access</h2>
      <p className="text-white/40 text-sm mb-10 text-center">Manage your portfolio content and settings from the admin terminal.</p>
      
      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-mac-green transition-colors" size={18} />
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 rounded-2xl focus:border-mac-green/50 outline-none transition-all placeholder:text-white/20 text-white"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-mac-green transition-colors" size={18} />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 rounded-2xl focus:border-mac-green/50 outline-none transition-all placeholder:text-white/20 text-white"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-mac-green text-black font-bold rounded-2xl hover:bg-mac-green/90 active:scale-[0.98] transition-all shadow-xl shadow-mac-green/20 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
