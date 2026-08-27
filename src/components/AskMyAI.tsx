'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { X, Send, User, Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AskMyAIProps {
  isOpen: boolean;
  onClose: () => void;
}

// Extract concatenated text from a UIMessage (v5+ messages are parts-based,
// there is no message.content anymore).
function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

const SUGGESTED_PROMPTS = [
  'What can Jhon Rey build?',
  'Tell me about SukiSuite.',
  'What technologies does he use?',
  'Is Jhon Rey available for freelance work?',
];

export default function AskMyAI({ isOpen, onClose }: AskMyAIProps) {
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const isLoading = status === 'submitted' || status === 'streaming';
  const [input, setInput] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [bootText, setBootText] = useState('');

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
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
      // Reset boot state when closing so it plays again when reopened, or we can leave it false
      setIsBooting(true);
      setBootText('');
    }
  }, [isOpen, onClose]);

  // Boot sequence effect
  useEffect(() => {
    if (isOpen && isBooting) {
      const text = 'connecting to jhonrey...';
      let i = 0;
      const interval = setInterval(() => {
        setBootText(text.slice(0, i + 1));
        i++;
        if (i === text.length) {
          clearInterval(interval);
          setTimeout(() => setIsBooting(false), 500); // short pause before revealing UI
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen, isBooting]);

  const handleSuggestedPrompt = (promptText: string) => {
    if (isLoading) return;
    sendMessage({ text: promptText });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-my-ai-title"
      aria-describedby="ask-my-ai-desc"
      ref={modalRef}
    >
      <div className="animate-slide-in-right relative flex h-full w-full flex-col border-l border-white/10 bg-[var(--bg-primary)] shadow-[-20px_0_40px_rgba(0,0,0,0.5)] sm:w-[450px] md:w-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[var(--bg-secondary)] px-6 py-4">
          <div className="flex items-center gap-3 font-mono">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-volt)]/50 bg-[var(--color-volt)]/10 text-[var(--color-volt)]">
              <Image
                src="/site-assets/brand/preloader-glyph.webp"
                alt="Glyph"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <div>
              <h3 id="ask-my-ai-title" className="font-bold tracking-tight text-white">
                Ask My AI
              </h3>
              <p id="ask-my-ai-desc" className="text-xs text-[var(--text-secondary)]">
                Strictly grounded in verified portfolio data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages([])}
              title="Clear Conversation"
              aria-label="Clear conversation"
              className="rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-white"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={onClose}
              title="Close"
              aria-label="Close dialog"
              className="rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div
          className="relative flex-1 space-y-6 overflow-y-auto scroll-smooth p-6"
          aria-live="polite"
        >
          {isBooting ? (
            <div className="flex h-full flex-col items-start justify-start pt-4 font-mono text-sm text-[var(--color-volt)]">
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span>
                  {bootText}
                  <span className="animate-pulse">_</span>
                </span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="animate-in fade-in flex h-full flex-col items-center justify-center space-y-6 text-center duration-500">
              <div className="mb-2 flex h-16 w-16 items-center justify-center">
                <Image
                  src="/site-assets/brand/preloader-glyph.webp"
                  alt="Glyph"
                  width={56}
                  height={56}
                  className="object-contain drop-shadow-[0_0_15px_rgba(232,245,74,0.3)]"
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">
                  Hi, I&apos;m Jhon Rey&apos;s AI Assistant.
                </h2>
                <p className="mx-auto max-w-md text-[var(--text-secondary)]">
                  I can answer questions about his skills, projects, and services based on his
                  verified portfolio data.
                </p>
              </div>

              <div className="mt-4 flex w-full max-w-xl flex-wrap justify-center gap-3">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-secondary)] transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-volt)]/30 bg-[var(--color-volt)]/20 text-[var(--color-volt)]">
                      <Image
                        src="/site-assets/brand/preloader-glyph.webp"
                        alt="Glyph"
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                      message.role === 'user'
                        ? 'bg-[var(--color-volt)] text-[var(--color-bg)]'
                        : 'border border-white/10 bg-white/5 text-white/90'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {getMessageText(message)}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{getMessageText(message)}</p>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                      <User size={16} aria-hidden="true" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start gap-4" aria-live="polite" aria-busy="true">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-volt)]/30 bg-[var(--color-volt)]/20 text-[var(--color-volt)]">
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-[var(--text-secondary)]">
                    Thinking<span className="animate-pulse">...</span>
                  </div>
                </div>
              )}
            </>
          )}

          {error && (
            <div className="flex justify-start gap-4" role="alert" aria-live="assertive">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/20 text-red-400">
                <Image
                  src="/site-assets/brand/preloader-glyph.webp"
                  alt="Glyph"
                  width={16}
                  height={16}
                  className="object-contain opacity-50 grayscale"
                />
              </div>
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
                {error.message || 'An error occurred. Please try again later.'}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 bg-[var(--bg-secondary)] p-4">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about Jhon Rey's work..."
              className="w-full rounded-full border border-white/10 bg-black/50 py-4 pr-14 pl-6 text-sm text-white placeholder-[var(--text-secondary)] transition-all focus:border-[var(--color-volt)]/50 focus:ring-1 focus:ring-[var(--color-volt)]/50 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-volt)] text-[var(--color-bg)] transition-colors hover:bg-[var(--color-volt-light)] disabled:bg-white/10 disabled:text-white/30"
            >
              <Send size={16} className="ml-0.5" aria-hidden="true" />
            </button>
          </form>
          <div className="mt-3 text-center">
            <span className="text-[10px] text-[var(--text-secondary)]">
              Responses are generated by AI and limited to verified portfolio data.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
