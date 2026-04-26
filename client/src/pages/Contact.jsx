import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Send, Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('messages').insert([formData]);
      
      if (error) throw error;
      
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-6">Let's Connect</h2>
          <p className="text-white/50 mb-8">
            Have a question or want to work together? Feel free to reach out across any platform or use the contact form.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 glass rounded-lg flex items-center justify-center text-mac-green">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase font-bold tracking-widest">Email</p>
                <p className="text-white/80">[kumarajeet19022004@gmail.com]</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 glass rounded-lg flex items-center justify-center text-mac-yellow">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase font-bold tracking-widest">Phone</p>
                <p className="text-white/80">+91 9546936532</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 glass rounded-lg flex items-center justify-center text-mac-red">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase font-bold tracking-widest">Location</p>
                <p className="text-white/80">Delhi, India</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              required
              className="glass p-3 rounded-lg focus:border-mac-green outline-none w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              required
              className="glass p-3 rounded-lg focus:border-mac-green outline-none w-full"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <input
            type="text"
            placeholder="Subject"
            className="glass p-3 rounded-lg focus:border-mac-green outline-none w-full"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
          <textarea
            placeholder="Your Message"
            required
            rows={5}
            className="glass p-3 rounded-lg focus:border-mac-green outline-none w-full resize-none"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-mac-green text-black font-bold rounded-lg hover:bg-mac-green/90 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Sending...' : <><Send size={18} /> Send Message</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
