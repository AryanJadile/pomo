import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SuggestionChips from './SuggestionChips';

export default function ChatPanel({
  isOpen,
  onClose,
  messages,
  isStreaming,
  inputValue,
  setInputValue,
  onSend,
  onSendText,
  scanData
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll mechanics
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  if (!isOpen) return null;
  
  const fruitName = scanData?.input_data?.fruit_name || 'Crop';

  return (
    <div className="fixed bottom-[90px] right-6 w-full max-w-[380px] h-[520px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-[9999] border
      transform transition-transform duration-300 ease-out translate-y-0
      sm:max-w-[400px] max-sm:w-[92vw] max-sm:right-[4vw] max-sm:h-[65vh] max-sm:bottom-[80px]"
    >
      {/* Header */}
      <div className="bg-[#C0392B] text-white px-4 py-3 flex items-center justify-between shadow-sm relative z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-1.5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] leading-tight flex items-center gap-1">PomeGuard Agronomist</span>
            <span className="text-[11px] text-white/80 uppercase tracking-widest font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Reviewing: {fruitName}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      {/* Message Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 bg-slate-50/50">
        {messages.map((m, i) => (
          <MessageBubble key={m.id || i} role={m.role} content={m.content} timestamp={m.timestamp} />
        ))}
        {isStreaming && (!messages.length || messages[messages.length - 1].content === "") && (
          <TypingIndicator />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips - Render immediately after greeting (1 message) */}
      {messages.length === 1 && !isStreaming && (
        <SuggestionChips scanData={scanData} onSelect={onSendText} />
      )}

      {/* Input Form */}
      <div className="border-t bg-white px-3 py-3 shrink-0">
        <form 
          className="flex items-end gap-2 relative"
          onSubmit={e => {
            e.preventDefault();
            onSend();
          }}
        >
          {inputValue.length >= 400 && (
            <div className="absolute -top-5 right-12 text-[10px] text-gray-400 font-medium">
              {inputValue.length}/500
            </div>
          )}
          <textarea 
            className="flex-1 max-h-[120px] min-h-[44px] bg-slate-100 border-transparent rounded-lg px-3 py-2.5 text-[14px] text-slate-800 focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400 max-sm:text-[16px]"
            placeholder="Ask about your analysis..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value.slice(0, 500))}
            disabled={isStreaming}
            rows={1}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <button 
            type="submit" 
            disabled={isStreaming || !inputValue.trim()}
            className="h-[44px] w-[44px] shrink-0 bg-[#C0392B] rounded-full flex justify-center items-center text-white disabled:opacity-40 disabled:bg-gray-400 hover:bg-[#a63125] transition-colors focus:ring-2 focus:ring-red-300 focus:outline-none"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
