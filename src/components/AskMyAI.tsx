'use client';

import React, { useEffect, useEffectEvent, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { X, Send, User, Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';
import { useDialog } from '@/hooks/useDialog';

// The markdown engine (unified/remark/rehype chain) is the heaviest import in
// this panel and is only needed once the user opens the chat. Load it lazily
// so it stays out of the initial page bundle.
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false,
  loading: () => null,
});

interface AskMyAIProps {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLElement | null>;
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
  'What DataCamp credentials has he earned?',
  'Tell me about SukiSuite.',
  'What technologies does he use?',
  'Is Jhon Rey available for freelance work?',
];

export default function AskMyAI({ isOpen, onClose, returnFocusRef }: AskMyAIProps) {
  const { messages, sendMessage, status, error, setMessages, stop, clearError } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const isLoading = status === 'submitted' || status === 'streaming';
  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesContentRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const followMessagesRef = useRef(true);
  useDialog(isOpen, modalRef, onClose, inputRef, returnFocusRef);

  const scrollToLatest = useEffectEvent(() => {
    const area = messagesRef.current;
    if (!area || !followMessagesRef.current) return;
    // Scroll the CHAT, never scrollIntoView on a descendant of the page.
    // Instant updates don't queue competing animations as tokens arrive.
    area.scrollTo({ top: messages.length ? area.scrollHeight : 0, behavior: 'instant' });
  });

  useEffect(() => {
    if (!isOpen || !messagesRef.current || !messagesContentRef.current) return;
    // The lazy Markdown renderer can change height AFTER a message has arrived.
    // Observe actual content/viewport size instead of relying only on message state.
    const observer = new ResizeObserver(() => scrollToLatest());
    observer.observe(messagesRef.current);
    observer.observe(messagesContentRef.current);
    const frame = requestAnimationFrame(() => scrollToLatest());
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [isOpen]);

  const handleClear = async () => {
    await stop();
    setMessages([]);
    clearError();
    setInput('');
    followMessagesRef.current = true;
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleSuggestedPrompt = (promptText: string) => {
    if (isLoading) return;
    followMessagesRef.current = true;
    void sendMessage({ text: promptText });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    followMessagesRef.current = true;
    void sendMessage({ text });
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
      tabIndex={-1}
      data-lenis-prevent
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="animate-slide-in-right relative flex h-dvh w-full min-w-0 flex-col border-l border-white/10 bg-[var(--bg-primary)] shadow-[-20px_0_40px_rgba(0,0,0,0.5)] sm:w-[450px] md:w-[500px]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[var(--bg-secondary)] px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3 font-mono">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-volt)]/50 bg-[var(--color-volt)]/10 text-[var(--color-volt)]">
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
                Grounded in verified work, skills, and DataCamp credentials
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={handleClear}
              title="Clear Conversation"
              aria-label="Clear conversation"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-white"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={onClose}
              title="Close"
              aria-label="Close dialog"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div
          ref={messagesRef}
          role="log"
          tabIndex={0}
          aria-label="Conversation"
          data-lenis-prevent
          onScroll={(event) => {
            const area = event.currentTarget;
            followMessagesRef.current = area.scrollHeight - area.scrollTop - area.clientHeight < 80;
          }}
          className="relative min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-4 sm:p-6"
          aria-live="polite"
        >
          <div ref={messagesContentRef} className="flex min-h-full flex-col gap-6">
            {messages.length === 0 ? (
              <div className="animate-in fade-in my-auto flex flex-col items-center justify-center space-y-6 py-4 text-center duration-500">
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
                    I can answer questions about his skills, projects, services, and DataCamp
                    credentials based on his verified portfolio data.
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
                      className={`max-w-[85%] min-w-0 rounded-2xl px-4 py-3 [overflow-wrap:anywhere] ${
                        message.role === 'user'
                          ? 'bg-[var(--color-volt)] text-[var(--color-bg)]'
                          : 'border border-white/10 bg-white/5 text-white/90'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="chat-markdown text-sm leading-relaxed">
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
          </div>
        </div>

        {/* Input Area */}
        <div className="shrink-0 border-t border-white/10 bg-[var(--bg-secondary)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              aria-label="Your message"
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
              className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-volt)] text-[var(--color-bg)] transition-colors hover:bg-[var(--color-volt-light)] disabled:bg-white/10 disabled:text-white/30"
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
