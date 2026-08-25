"use client";

import React, { useState, useEffect } from 'react';
import { User, Briefcase, Mail, FolderOpen, TerminalSquare, Minus, Square, X, Cpu, GitMerge } from 'lucide-react';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import ResumeService from '@/components/ResumeService';
import Contact from '@/components/Contact';

export default function Home() {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const openWindow = (id: string) => setActiveWindow(id);
  const closeWindow = () => setActiveWindow(null);

  const renderContent = () => {
    switch (activeWindow) {
      case 'services': return <Services />;
      case 'portfolio': return <Portfolio />;
      case 'resume': return <ResumeService />;
      case 'contact': return <Contact />;
      default: return null;
    }
  };

  const getWindowTitle = () => {
    switch (activeWindow) {
      case 'services': return "Services & Capabilities";
      case 'portfolio': return "Projects_Log";
      case 'resume': return "Resume Services";
      case 'contact': return "Initialize_Contact";
      default: return "";
    }
  };

  const getWindowIcon = () => {
    switch (activeWindow) {
      case 'services': return <Cpu size={14} />;
      case 'portfolio': return <FolderOpen size={14} />;
      case 'resume': return <User size={14} />;
      case 'contact': return <Mail size={14} />;
      default: return null;
    }
  };

  return (
    <>
      <div className="desktop-area">
        <div className="desktop-icons">
          <div className="desktop-icon" onDoubleClick={() => openWindow('services')} onClick={() => openWindow('services')}>
            <Cpu size={32} />
            <span>My Services</span>
          </div>
          <div className="desktop-icon" onDoubleClick={() => openWindow('portfolio')} onClick={() => openWindow('portfolio')}>
            <FolderOpen size={32} />
            <span>Portfolio</span>
          </div>
          <div className="desktop-icon" onDoubleClick={() => openWindow('resume')} onClick={() => openWindow('resume')}>
            <User size={32} />
            <span>Resume</span>
          </div>
          <div className="desktop-icon" onDoubleClick={() => openWindow('contact')} onClick={() => openWindow('contact')}>
            <Mail size={32} />
            <span>Contact Me</span>
          </div>
          <div className="desktop-icon">
            <TerminalSquare size={32} />
            <span>cmd.exe</span>
          </div>
        </div>

        {activeWindow && (
          <div className="xp-window">
            <div className="xp-titlebar">
              <div className="xp-titlebar-title">
                {getWindowIcon()}
                {getWindowTitle()}
              </div>
              <div className="xp-controls">
                <button className="xp-btn xp-btn-min">_</button>
                <button className="xp-btn xp-btn-max">□</button>
                <button className="xp-btn xp-btn-close" onClick={closeWindow}>X</button>
              </div>
            </div>
            <div className="xp-toolbar">
              <span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span><span>Help</span>
            </div>
            <div className="xp-content">
              {renderContent()}
            </div>
          </div>
        )}
      </div>

      <footer className="xp-taskbar">
        <div className="xp-start">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M2.5 12a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" opacity="0.3"/>
            <path d="M12 2v20M2 12h20M12 12L4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          start
        </div>
        <div className="xp-taskbar-items">
          {activeWindow && (
            <div className="xp-taskbar-item active">
              {getWindowIcon()} {getWindowTitle()}
            </div>
          )}
        </div>
        <div className="xp-taskbar-tray">
          <span style={{ marginRight: '8px' }}>Jhon Rey</span>
          {time}
        </div>
      </footer>
    </>
  );
}
