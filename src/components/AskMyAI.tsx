"use client";

import React, { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { Terminal, X, Send, Bot, User, Loader2, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AskMyAIProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  "What can Jhon Rey build?",
  "Tell me about SukiSuite.",
  "What technologies does he use?",
  "Is Jhon Rey available for freelance work?",
];

export default function AskMyAI({ isOpen, onClose }: AskMyAIProps) {
  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, error, append } = useChat({
    api: '/api/chat',
    onError: (err) => console.error("Chat Error:", err)
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus trap and accessibility management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }
        
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length === 0) return;
          
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else if (previousFocusRef.current) {
      // Restore focus when closed
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen, onClose]);

  const handleSuggestedPrompt = (promptText: string) => {
    append({
      id: crypto.randomUUID(),
      role: 'user',
      content: promptText
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-my-ai-title"
      aria-describedby="ask-my-ai-desc"
      ref={modalRef}
    >
      <div className="w-full max-w-3xl h-[85vh] sm:h-[80vh] flex flex-col bg-[var(--bg-primary)] border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.15)] overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-violet)]/20 border border-[var(--color-violet)]/50 flex items-center justify-center text-[var(--color-violet-light)]">
              <Bot size={18} />
            </div>
            <div>
              <h3 id="ask-my-ai-title" className="font-bold text-white tracking-tight">Ask My AI</h3>
              <p id="ask-my-ai-desc" className="text-xs text-[var(--text-secondary)]">Strictly grounded in verified portfolio data</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMessages([])}
              title="Clear Conversation"
              aria-label="Clear conversation"
              className="p-2 text-[var(--text-secondary)] hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              onClick={onClose}
              title="Close"
              aria-label="Close dialog"
              className="p-2 text-[var(--text-secondary)] hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth" aria-live="polite">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-violet)]/10 border border-[var(--color-violet)]/20 flex items-center justify-center text-[var(--color-violet-light)] mb-2">
                <Terminal size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Hi, I&apos;m Jhon Rey&apos;s AI Assistant.</h2>
                <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                  I can answer questions about his skills, projects, and services based on his verified portfolio data.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 w-full max-w-xl mt-4">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[var(--text-secondary)] text-sm hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-[var(--color-violet)]/20 border border-[var(--color-violet)]/30 flex items-center justify-center text-[var(--color-violet-light)] shrink-0 mt-1">
                      <Bot size={16} aria-hidden="true" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                    message.role === 'user' 
                      ? 'bg-[var(--color-violet)] text-white' 
                      : 'bg-white/5 border border-white/10 text-white/90'
                  }`}>
                    {message.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-1">
                      <User size={16} aria-hidden="true" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4 justify-start" aria-live="polite" aria-busy="true">
                   <div className="w-8 h-8 rounded-full bg-[var(--color-violet)]/20 border border-[var(--color-violet)]/30 flex items-center justify-center text-[var(--color-violet-light)] shrink-0 mt-1">
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[var(--text-secondary)] text-sm flex items-center gap-2">
                    Thinking<span className="animate-pulse">...</span>
                  </div>
                </div>
              )}
            </>
          )}

          {error && (
            <div className="flex gap-4 justify-start" role="alert" aria-live="assertive">
               <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 mt-1">
                <Terminal size={16} aria-hidden="true" />
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 text-red-400 text-sm">
                {error.message || "An error occurred. Please try again later."}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[var(--bg-secondary)] border-t border-white/10">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything about Jhon Rey's work..."
              className="w-full bg-black/50 border border-white/10 rounded-full pl-6 pr-14 py-4 text-sm text-white placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--color-violet)]/50 focus:ring-1 focus:ring-[var(--color-violet)]/50 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="absolute right-2 w-10 h-10 flex items-center justify-center bg-[var(--color-violet)] hover:bg-[var(--color-violet-light)] disabled:bg-white/10 disabled:text-white/30 text-white rounded-full transition-colors"
            >
              <Send size={16} className="ml-0.5" aria-hidden="true" />
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[10px] text-[var(--text-secondary)]">
              Responses are generated by AI and limited to verified portfolio data.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
