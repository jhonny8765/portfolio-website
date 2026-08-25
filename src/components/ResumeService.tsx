import React from 'react';
import { FileText } from 'lucide-react';

export default function ResumeService() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <FileText size={48} style={{ color: '#0054e3', marginBottom: '15px' }} />
      
      <h2 style={{ fontSize: '18px', margin: '0 0 10px 0' }}>Resume Services</h2>
      <p style={{ margin: '0 auto 20px', maxWidth: '400px', color: '#333' }}>
        Get your career materials polished by someone who understands what hiring managers and automated systems look for.
      </p>
      
      <div style={{ background: '#ece9d8', border: '1px solid #7f9db9', padding: '15px', textAlign: 'left', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Included Deliverables:</h4>
        <ul style={{ margin: '0 0 0 20px', padding: 0 }}>
          <li>ATS-Optimized Resume</li>
          <li>Cover Letter Template</li>
          <li>LinkedIn Profile Copy</li>
        </ul>
      </div>

      <button className="xp-button">Request Review</button>
    </div>
  );
}
