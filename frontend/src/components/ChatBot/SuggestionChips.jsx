import React from 'react';

export default function SuggestionChips({ scanData, onSelect }) {
  const getChips = (data) => {
    const isHealthy = !data?.result?.disease || 
      data.result.disease.toLowerCase() === 'healthy';
      
    const fruitName = data?.input_data?.fruit_name || 'fruit';
    const diseaseName = data?.result?.disease || 'the condition';
  
    if (!isHealthy) return [
      `What is ${diseaseName} and how serious is it?`,
      `How do I treat ${diseaseName}?`,
      `Will this affect the fruit's market value?`
    ];
    
    return [
      `What do my phytochemical levels mean?`,
      `Is my ${fruitName} safe for consumption?`,
      `How can I improve the nutritional score next time?`
    ];
  };

  const chips = getChips(scanData);

  return (
    <div className="flex flex-col gap-2 mt-2 w-full max-w-[85%] mb-4 opacity-90 animate-in fade-in duration-500">
      <p className="text-[10px] text-gray-500 font-medium px-1 uppercase tracking-wider">Suggested Questions</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((c, i) => (
          <button 
            key={i}
            onClick={() => onSelect(c)}
            className="flex-shrink-0 border border-[#C0392B] bg-white text-[#C0392B] hover:bg-[#C0392B] hover:text-white transition-colors duration-200 rounded-[20px] px-3.5 py-1.5 text-[12px] font-medium leading-tight shadow-sm max-w-full text-left"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
