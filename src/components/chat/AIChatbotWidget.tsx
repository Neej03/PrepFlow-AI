'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  MessageSquare, 
  RefreshCw, 
  Copy, 
  Check, 
  BookOpen,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { ProcessedMaterial } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIChatbotWidgetProps {
  currentMaterial?: ProcessedMaterial | null;
  customApiKey?: string;
}

const SUGGESTIONS = [
  "💡 Explain this concept in simple terms",
  "📝 Give me a practical example problem",
  "🎯 What topics are most likely on the exam?",
  "🧠 Summarize the core formulas & definitions"
];

export const AIChatbotWidget: React.FC<AIChatbotWidgetProps> = ({
  currentMaterial,
  customApiKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      role: 'assistant',
      content: 'Hi! I am **PrepFlow AI**, your 24/7 academic tutor. Ask me anything about your study material, key formulas, or exam prep strategies!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend || textToSend.trim() === '' || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!overrideText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          materialContext: currentMaterial ? {
            title: currentMaterial.notes.title,
            overview: currentMaterial.notes.overview,
            keyConcepts: currentMaterial.notes.keyConcepts,
            definitions: currentMaterial.notes.definitions,
          } : undefined,
          customApiKey
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: data.reply || 'I am ready to help you study! What topic shall we review next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: 'I had a brief connection timeout, but feel free to ask your question again or try a suggested topic below!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'init_' + Date.now(),
        role: 'assistant',
        content: 'Chat cleared. Ask me any question about your lectures or study topics!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Button Launcher (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative group flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold text-xs shadow-2xl shadow-indigo-600/50 border border-indigo-400/40 cursor-pointer"
            >
              <div className="relative">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
              </div>
              <span className="hidden sm:inline">Ask AI Assistant</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Chat Window Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-extrabold text-sm text-white">PrepFlow AI Assistant</h3>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      TUTOR
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-400 font-medium">Gemini 2.5 Active • Ask Anything</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={handleClearChat}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition text-xs"
                  title="Clear chat history"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Context Banner (If current material active) */}
            {currentMaterial && (
              <div className="px-4 py-1.5 bg-indigo-950/50 border-b border-indigo-500/20 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5 text-indigo-300 truncate">
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold truncate">Context: {currentMaterial.notes.title}</span>
                </div>
                <span className="text-[9px] text-indigo-400 font-bold bg-indigo-500/20 px-1.5 py-0.5 rounded">
                  LOADED
                </span>
              </div>
            )}

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md'
                          : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-inner'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                    </div>

                    <div className="flex items-center space-x-2 px-1">
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="text-slate-500 hover:text-slate-300 transition"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center space-x-2 p-3 rounded-2xl bg-slate-950/90 border border-slate-800 max-w-[70%]">
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span className="text-xs text-slate-400 font-medium">PrepFlow AI is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-2 border-t border-slate-800/60 bg-slate-950/40 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
              {SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug.replace(/^[^\s]+\s/, ''))}
                  className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-700/60 text-[11px] font-medium whitespace-nowrap transition"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask any question about your studies..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className={`p-2.5 rounded-xl transition ${
                  input.trim() && !isLoading
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
