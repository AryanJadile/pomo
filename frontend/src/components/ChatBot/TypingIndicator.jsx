import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex w-full items-start mb-1">
      <div className="bg-white px-4 py-3.5 border border-slate-100 rounded-[18px_18px_18px_4px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5 h-[34px]">
        {/* CSS Keyframe animations for staggered bouncing dots */}
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
}
