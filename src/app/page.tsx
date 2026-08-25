"use client";

import React, { useState, useEffect } from 'react';
import { User, Briefcase, Mail, FolderOpen, TerminalSquare, Cpu, Search, Wifi, Battery, Signal, ChevronLeft, Circle, Square, Triangle, Gamepad2, Settings } from 'lucide-react';
import Draggable from 'react-draggable';

import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import ResumeService from '@/components/ResumeService';
import Contact from '@/components/Contact';
import SnakeGame from '@/components/SnakeGame';
import LiveMessenger from '@/components/LiveMessenger';

export default function Home() {
  const [activeWindows, setActiveWindows] = useState<string[]>([]);
  const [focusedWindow, setFocusedWindow] = useState<string | null>(null);
  
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const openWindow = (id: string) => {
    if (!activeWindows.includes(id)) {
      setActiveWindows(prev => [...prev, id]);
    }
    setFocusedWindow(id);
  };

  const closeWindow = (id: string) => {
    setActiveWindows(prev => prev.filter(w => w !== id));
    if (focusedWindow === id) setFocusedWindow(null);
  };

  const renderContent = (id: string) => {
    switch (id) {
      case 'services': return <Services />;
      case 'portfolio': return <Portfolio />;
      case 'resume': return <ResumeService />;
      case 'contact': return <Contact />;
      case 'snake': return <SnakeGame />;
      default: return null;
    }
  };

  const getWindowTitle = (id: string) => {
    switch (id) {
      case 'services': return "Services & Capabilities";
      case 'portfolio': return "Projects Log";
      case 'resume': return "Resume Services";
      case 'contact': return "Contact Jhon Rey";
      case 'snake': return "Snake (Classic)";
      default: return "Application";
    }
  };

  const getWindowIcon = (id: string, size = 14) => {
    switch (id) {
      case 'services': return <Cpu size={size} />;
      case 'portfolio': return <FolderOpen size={size} />;
      case 'resume': return <User size={size} />;
      case 'contact': return <Mail size={size} />;
      case 'snake': return <Gamepad2 size={size} />;
      default: return <Settings size={size} />;
    }
  };

  return (
    <>
      {/* ----------------- DESKTOP: WINDOWS XP LUNA ----------------- */}
      <div className="show-desktop desktop-area">
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
          <div className="desktop-icon" onDoubleClick={() => openWindow('snake')} onClick={() => openWindow('snake')}>
            <Gamepad2 size={32} />
            <span>Snake Game</span>
          </div>
        </div>

        {activeWindows.map((id, index) => (
          <Draggable key={id} handle=".xp-titlebar" onMouseDown={() => setFocusedWindow(id)}>
            <div 
              className="xp-window" 
              style={{ 
                zIndex: focusedWindow === id ? 1000 : 100 + index,
                position: 'absolute',
                top: `${10 + index * 2}%`,
                left: `${20 + index * 2}%`
              }}
            >
              <div className="xp-titlebar" style={{ cursor: 'grab' }}>
                <div className="xp-titlebar-title">
                  {getWindowIcon(id)}
                  {getWindowTitle(id)}
                </div>
                <div className="xp-controls">
                  <button className="xp-btn xp-btn-min">_</button>
                  <button className="xp-btn xp-btn-max">□</button>
                  <button className="xp-btn xp-btn-close" onClick={() => closeWindow(id)}>X</button>
                </div>
              </div>
              <div className="xp-toolbar">
                <span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span><span>Help</span>
              </div>
              <div className="xp-content">
                {renderContent(id)}
              </div>
            </div>
          </Draggable>
        ))}

        <LiveMessenger />
      </div>

      <footer className="show-desktop xp-taskbar">
        <div className="xp-start">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M2.5 12a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" opacity="0.3"/>
            <path d="M12 2v20M2 12h20M12 12L4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          start
        </div>
        <div className="xp-taskbar-items">
          {activeWindows.map(id => (
            <div 
              key={id} 
              className={`xp-taskbar-item ${focusedWindow === id ? 'active' : ''}`}
              onClick={() => setFocusedWindow(id)}
            >
              {getWindowIcon(id)} {getWindowTitle(id)}
            </div>
          ))}
        </div>
        <div className="xp-taskbar-tray">
          <span style={{ marginRight: '8px' }}>Jhon Rey</span>
          {time}
        </div>
      </footer>

      {/* ----------------- MOBILE: ANDROID OS ----------------- */}
      <div className="show-mobile android-container">
        
        <div className="android-status-bar">
          <div>{time}</div>
          <div className="android-status-icons">
            <Wifi size={14} />
            <Signal size={14} />
            <Battery size={14} />
          </div>
        </div>

        <div className="android-home">
          <div className="android-widget-clock">
            <h1>{time.split(' ')[0]}</h1>
            <p>{date}</p>
          </div>

          <div className="android-search">
            <Search size={18} opacity={0.7} />
            <span>Search apps...</span>
          </div>

          <div className="android-grid">
            <div className="android-app-icon" onClick={() => openWindow('services')}>
              <div className="android-icon-box"><Cpu size={28} /></div>
              <span>Services</span>
            </div>
            <div className="android-app-icon" onClick={() => openWindow('portfolio')}>
              <div className="android-icon-box"><FolderOpen size={28} /></div>
              <span>Portfolio</span>
            </div>
            <div className="android-app-icon" onClick={() => openWindow('resume')}>
              <div className="android-icon-box"><User size={28} /></div>
              <span>Resume</span>
            </div>
            <div className="android-app-icon" onClick={() => openWindow('snake')}>
              <div className="android-icon-box" style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }}><Gamepad2 size={28} color="#d81b60" /></div>
              <span>Snake</span>
            </div>
          </div>

          <div className="android-dock">
            <div className="android-app-icon" onClick={() => openWindow('contact')}>
              <div className="android-icon-box" style={{ background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', borderRadius: '50%' }}><Mail size={28} color="#1565c0" /></div>
            </div>
            <div className="android-app-icon" onClick={() => openWindow('portfolio')}>
              <div className="android-icon-box" style={{ background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', borderRadius: '50%' }}><FolderOpen size={28} color="#4527a0" /></div>
            </div>
            <div className="android-app-icon" onClick={() => openWindow('services')}>
              <div className="android-icon-box" style={{ background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', borderRadius: '50%' }}><Cpu size={28} color="#00695c" /></div>
            </div>
            <div className="android-app-icon" onClick={() => openWindow('snake')}>
              <div className="android-icon-box" style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', borderRadius: '50%' }}><Gamepad2 size={28} color="#d84315" /></div>
            </div>
          </div>
        </div>

        {focusedWindow && (
          <div className="android-app-view">
            <div className="android-app-header">
              <button onClick={() => setFocusedWindow(null)}><ChevronLeft size={24} /></button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#1a4b8c' }}>{getWindowIcon(focusedWindow, 20)}</span>
                <span className="android-app-title">{getWindowTitle(focusedWindow)}</span>
              </div>
            </div>
            <div className="android-app-content">
              {renderContent(focusedWindow)}
            </div>
          </div>
        )}

        <div className="android-nav-bar">
          <Triangle size={18} fill="white" onClick={() => setFocusedWindow(null)} style={{ transform: 'rotate(-90deg)', cursor: 'pointer' }} />
          <Circle size={18} fill="white" onClick={() => setFocusedWindow(null)} style={{ cursor: 'pointer' }} />
          <Square size={18} fill="white" style={{ cursor: 'pointer' }} />
        </div>

      </div>
    </>
  );
}
