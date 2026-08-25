"use client";

import React, { useState } from 'react';
import { User, MessageCircle, MoreHorizontal } from 'lucide-react';
import Draggable from 'react-draggable';

export default function LiveMessenger() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <Draggable handle=".messenger-title">
      <div style={{
        position: 'absolute',
        bottom: '40px',
        right: '20px',
        width: '250px',
        background: '#ece9d8',
        border: '3px solid #0054e3',
        borderRadius: '8px 8px 0 0',
        boxShadow: '2px 2px 10px rgba(0,0,0,0.5)',
        zIndex: 9999,
        fontFamily: 'Tahoma, sans-serif'
      }}>
        <div className="messenger-title" style={{
          background: 'linear-gradient(to bottom, #0058e6 0%, #127dff 8%, #0045d4 20%, #0033b0 56%, #0054d0 100%)',
          padding: '3px 5px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '12px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
          cursor: 'grab'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <MessageCircle size={14} color="#54c854" />
            Live Messenger
          </div>
          <button 
            onClick={() => setClosed(true)}
            style={{
              width: '18px', height: '18px', 
              background: 'linear-gradient(to bottom, #e07f7f 0%, #d82a2a 50%, #d93f3f 100%)', 
              border: '1px solid white', borderRadius: '3px', color: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}>
            X
          </button>
        </div>
        
        <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '1px solid white' }}>
          <div style={{ 
            width: '60px', height: '60px', 
            background: 'white', border: '1px solid #7f9db9', 
            borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '10px'
          }}>
            <User size={40} color="#0054e3" />
          </div>
          
          <h3 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#000' }}>Jhon Rey</h3>
          <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#54c854', borderRadius: '50%' }}></span>
            (Online)
          </p>

          <div style={{ fontSize: '11px', color: '#0054e3', textDecoration: 'underline', cursor: 'pointer', marginBottom: '5px' }}>
            jhonny8765@hotmail.com
          </div>
          
          <div style={{ width: '100%', height: '1px', background: '#ccc', margin: '10px 0' }}></div>
          
          <a href="#contact" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#333', textDecoration: 'none' }}>
            <MoreHorizontal size={14} /> Send an instant message...
          </a>
        </div>
      </div>
    </Draggable>
  );
}
