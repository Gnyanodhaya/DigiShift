import React, { useState, useRef, useEffect } from 'react';
import { SMEProfile, PillarScore, ProcessBottleneck, RoadmapMilestone } from '../types/advisor';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Maximize2,
  Minimize2,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  CornerDownLeft,
} from 'lucide-react';

interface AIChatBotProps {
  profile: SMEProfile;
  overallScore: number;
  pillarScores: PillarScore[];
  bottlenecks: ProcessBottleneck[];
  roadmap: RoadmapMilestone[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({
  profile,
  overallScore,
  pillarScores,
  bottlenecks,
  roadmap,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialWelcome = `Hello! I am your **DigiShift AI Transformation Advisor**.

I have reviewed **${profile.name}**'s assessment (Maturity Score: **${overallScore}/100**). Your primary operational drag is currently **${bottlenecks[0]?.title || 'manual paperwork'}** (~${bottlenecks[0]?.wastedHoursWeekly || 14} hrs/week).

Ask me anything about software stacks, employee change management, ROI calculations, or implementation timelines!`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: initialWelcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Quick suggestions tailored to current SME
  const suggestionPrompts = [
    `How do we get non-tech staff to adopt modern software?`,
    `What cloud software should we avoid for our ${profile.employees} employees?`,
    `How will Phase 1 reduce our Days Sales Outstanding?`,
    `Draft an executive 1-pager for our bank/investors on payback.`,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          context: {
            profile,
            overallScore,
            topBottlenecks: bottlenecks.slice(0, 3),
            roadmap: roadmap.slice(0, 3),
          },
        }),
      });

      const data = await response.json();
      const botReply = data.reply || "I'm analyzing your digital roadmap. Focusing on Phase 1 quick wins will yield the fastest financial payback.";

      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          content: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          content: 'I recommend focusing on your top bottleneck: automating the manual retyping of job orders into your accounting ledger. This will free up 10+ hours of administrative time per week.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: `Chat history cleared. How can I assist with ${profile.name}'s digital transformation?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl transition-all duration-200 border border-slate-700/50 group"
          title="Open DigiShift AI Advisor"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold leading-none flex items-center gap-1">
              <span>DigiShift AI</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-[10px] text-slate-400 dark:text-indigo-200 font-mono mt-0.5">
              Ask Advisor
            </div>
          </div>
        </button>
      )}

      {/* Interactive AI Chat Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'bottom-4 right-4 left-4 sm:left-auto sm:w-[640px] h-[640px] max-h-[88vh]'
              : 'bottom-4 right-4 left-4 sm:left-auto sm:w-[400px] h-[500px] max-h-[80vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-600/80 text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>DigiShift AI Advisor</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>Context: {profile.name.split(' ')[0]}</span>
                  <span>·</span>
                  <span className="text-indigo-300">{overallScore}/100</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClearChat}
                className="p-1.5 hover:text-white rounded hover:bg-slate-800"
                title="Clear chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:text-white rounded hover:bg-slate-800"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white rounded hover:bg-slate-800"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Ribbon */}
          <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 shrink-0">
            <span className="truncate">
              🎯 Top Priority: <strong className="font-semibold text-slate-900 dark:text-white">{bottlenecks[0]?.title || 'Cloud Invoicing'}</strong>
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0 ml-2">
              Payback: 3.4 mo
            </span>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-xs ${
                      isAssistant
                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed text-xs">
                      {m.content}
                    </div>

                    <div
                      className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[10px] ${
                        isAssistant
                          ? 'border-slate-100 dark:border-slate-700/60 text-slate-400'
                          : 'border-white/20 text-indigo-200'
                      }`}
                    >
                      <span>{m.timestamp}</span>
                      {isAssistant && (
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500 font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                <span>Advisor formulating recommendations...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Pills */}
          <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
            {suggestionPrompts.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(sug)}
                className="px-2.5 py-1 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 border border-slate-200 dark:border-slate-700"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Text Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about software selection, change management..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 rounded-xl disabled:opacity-40 transition-colors shrink-0 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
