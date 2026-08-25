"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', service: 'inquiry' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      setTimeout(() => setStatus('success'), 800);
      return;
    }

    try {
      const { error } = await supabase.from('contacts').insert([formData]);
      if (error) throw error;
      setStatus('success');
      setFormData({ name: '', email: '', message: '', service: 'inquiry' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <CheckCircle size={48} style={{ color: '#3c9a4e', marginBottom: '15px' }} />
        <h3 style={{ margin: '0 0 10px 0' }}>Message Sent Successfully!</h3>
        <p style={{ color: '#333', marginBottom: '20px' }}>I will get back to you as soon as possible.</p>
        <button onClick={() => setStatus('idle')} className="xp-button">OK</button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '18px', borderBottom: '1px solid #7f9db9', paddingBottom: '5px', margin: '0 0 15px 0' }}>Contact Jhon Rey</h2>
      
      {status === 'error' && (
        <div style={{ background: '#ffcccc', border: '1px solid red', padding: '5px', marginBottom: '15px' }}>
          An error occurred. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="grid-2">
          <div>
            <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold' }}>Name:</label>
            <input 
              required type="text" className="xp-input"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold' }}>Email:</label>
            <input 
              required type="email" className="xp-input"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold' }}>Service:</label>
          <select 
            className="xp-input"
            value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}
          >
            <option value="inquiry">General Inquiry</option>
            <option value="dev">Web & SaaS Development</option>
            <option value="automation">Business Automation</option>
            <option value="resume">Resume Services</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold' }}>Message:</label>
          <textarea 
            required rows={5} className="xp-input" style={{ resize: 'vertical' }}
            value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
          />
        </div>

        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <button type="submit" className="xp-button" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
}
