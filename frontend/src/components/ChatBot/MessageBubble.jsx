import React from 'react';

export default function MessageBubble({ role, content, timestamp }) {
  const isUser = role === 'user';
  
  // Format Date timestamp specifically omitting seconds
  let timeString = '';
  if (timestamp) {
    const d = new Date(timestamp);
    timeString = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'} mb-1`}>
      <div 
        className={`relative max-w-[85%] px-4 py-2.5 text-[14px] leading-relaxed max-sm:max-w-[88%] shadow-sm
          ${isUser 
            ? 'bg-[#C0392B] text-white rounded-[18px_18px_4px_18px]' 
            : 'bg-white text-slate-800 border border-slate-100 rounded-[18px_18px_18px_4px]'
          }`}
      >
        {/* We use pre-wrap so line breaks from the model render cleanly */}
        <span className="whitespace-pre-wrap">{content}</span>
      </div>
      {timeString && (
        <span className={`text-[10px] text-gray-400 mt-1 font-medium ${isUser ? 'mr-1' : 'ml-1'}`}>
          {timeString}
        </span>
      )}
    </div>
  );
}
