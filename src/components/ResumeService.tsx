import React from 'react';
import { FileText } from 'lucide-react';

export default function ResumeService() {
  return (
    <section className="section bg-surface">
      <div className="container">
        <div className="panel resume-panel">
          <FileText size={32} className="text-tertiary mb-6" />
          
          <h2 className="mb-4 text-primary">export function ResumeServices()</h2>
          <p className="text-secondary font-sans text-base resume-desc mb-8">
            Get your career materials polished by someone who understands what hiring managers and automated systems look for.
          </p>
          
          <div className="code-block resume-code mb-8">
            <span className="text-accent">const</span> deliverables = [<br/>
            &nbsp;&nbsp;<span className="text-success">"ATS-Optimized Resume"</span>,<br/>
            &nbsp;&nbsp;<span className="text-success">"Cover Letter Template"</span>,<br/>
            &nbsp;&nbsp;<span className="text-success">"LinkedIn Profile Copy"</span><br/>
            ];
          </div>

          <a href="#contact" className="btn btn-primary">
            ./request_review.sh
          </a>
        </div>
      </div>
    </section>
  );
}
