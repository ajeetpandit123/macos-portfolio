import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Lock, User } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('auth/login', formData);
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      toast.success('Login successful!');
      onLogin();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto">
      <div className="w-16 h-16 bg-mac-green rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        <Lock className="text-black" size={32} />
      </div>
      <h2 className="text-2xl font-bold mb-8">Admin Access</h2>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input
            type="text"
            placeholder="Username"
            required
            className="w-full glass pl-10 pr-4 py-3 rounded-xl focus:border-mac-green outline-none"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full glass pl-10 pr-4 py-3 rounded-xl focus:border-mac-green outline-none"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
