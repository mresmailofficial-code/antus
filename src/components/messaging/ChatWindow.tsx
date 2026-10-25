import React, { useState } from 'react';
import { ConversationThread } from '../../types';
import { useHuman } from '../../context/HumanContext';
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  CheckCheck, 
  MoreVertical, 
  Heart, 
  ThumbsUp, 
  Smile,
  Shield
} from 'lucide-react';

interface ChatWindowProps {
  thread: ConversationThread;
  onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ thread, onBack }) => {
  const { currentUser, messages, sendMessage, setIsSafetyCenterOpen } = useHuman();

  const threadMessages = messages[thread.id] || [];
  const [inputText, setInputText] = useState('');

  // Contextual icebreaker suggestions
  const icebreakerSuggestions = [
    'What is your favorite place to photograph in Jaipur?',
    'What movie could you watch forever?',
    'Have you tried the kulhad chai at Tapri Central?',
    'Are you planning on going to any weekend activities?',
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(thread.id, inputText.trim());
    setInputText('');
  };

  const handleSelectIcebreaker = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="flex-1 w-full h-full bg-sand-50 flex flex-col relative z-20 animate-fade-in pb-safe">
      
      {/* Top Bar */}
      <div className="glass-nav border-b border-sand-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-sand-200 text-charcoal-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <img
            src={thread.avatar}
            alt={thread.title}
            className="w-9 h-9 rounded-full object-cover border border-sand-300"
          />

          <div>
            <h2 className="text-xs font-bold text-charcoal-900 leading-tight">
              {thread.title}
            </h2>
            <span className="text-[10px] text-charcoal-500 block truncate">
              {thread.subtitle || 'Active in Jaipur'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsSafetyCenterOpen(true)}
          className="p-1.5 rounded-full hover:bg-sand-200 text-charcoal-600 transition-colors"
          title="Safety Controls"
        >
          <Shield className="w-4 h-4 text-forest-600" />
        </button>
      </div>

      {/* Context banner */}
      {thread.contextReason && (
        <div className="px-4 py-2 bg-sand-100/90 border-b border-sand-200/60 text-center flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span className="text-[11px] text-charcoal-700 font-medium">
            {thread.contextReason}
          </span>
        </div>
      )}

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {threadMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-full object-cover border border-sand-200 mb-0.5"
                />
              )}

              <div
                className={`max-w-[78%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-charcoal-900 text-white rounded-br-sm shadow-soft'
                    : 'bg-white text-charcoal-900 border border-sand-200 rounded-bl-sm shadow-soft'
                }`}
              >
                {!isMe && (
                  <span className="font-bold text-[10px] text-terracotta-600 block mb-1">
                    {msg.senderName}
                  </span>
                )}
                <p>{msg.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span
                    className={`text-[9px] ${
                      isMe ? 'text-charcoal-300' : 'text-charcoal-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                  {isMe && <CheckCheck className="w-3 h-3 text-terracotta-300" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Icebreakers Pill Row */}
      <div className="px-4 py-1.5 bg-sand-100/60 border-t border-sand-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider shrink-0">
          Icebreakers:
        </span>
        {icebreakerSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectIcebreaker(prompt)}
            className="text-[11px] px-3 py-1 rounded-full bg-white hover:bg-terracotta-50 hover:text-terracotta-700 text-charcoal-700 font-medium whitespace-nowrap border border-sand-200 transition-colors shrink-0"
          >
            "{prompt.slice(0, 34)}..."
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-sand-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-charcoal-900"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-sand-300 text-white flex items-center justify-center transition-all shadow-soft"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>

    </div>
  );
};
