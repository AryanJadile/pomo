import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import FloatingButton from './FloatingButton';
import ChatPanel from './ChatPanel';

export default function ChatBot({ scanId, scanData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Track specifically if this is the first time we've opened it
  // to avoid injecting the greeting message multiple times across rerenders.
  const hasGreeted = useRef(false);

  useEffect(() => {
    if (isOpen && !hasGreeted.current && messages.length === 0) {
      hasGreeted.current = true;
      
      const isHealthy = !scanData?.result?.disease || 
                        scanData.result.disease.toLowerCase() === 'healthy';
      
      const fruitName = scanData?.input_data?.fruit_name || 'fruit';
      const dateRaw = scanData?.created_at;
      const dateFormatted = dateRaw ? new Date(dateRaw).toLocaleDateString() : 'recently';
      
      const diseaseName = scanData?.result?.disease || 'an unknown condition';
      const confidence = scanData?.result?.confidence || 'N/A';

      const greetingText = isHealthy
        ? `Hello! I have reviewed your ${fruitName} analysis from ${dateFormatted}. Great news — your fruit appears completely healthy. Feel free to ask me anything about the results or what you should do next.`
        : `Hello! I have reviewed your ${fruitName} analysis from ${dateFormatted}. I can see that ${diseaseName} was detected with ${confidence}% confidence. Feel free to ask me anything about this condition or what steps to take.`;
      
      setMessages([{
        id: Date.now().toString(),
        role: "model",
        content: greetingText,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length, scanData]);

  const handleSend = async (textToSubmit = inputValue) => {
    const text = textToSubmit.trim();
    if (!text || isStreaming) return;
    
    // 1. Add User Msg
    setInputValue('');
    const userMsg = {
        id: Date.now().toString(),
        role: "user",
        content: text,
        timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    
    // 2. Add Empty Model Placeholder
    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: modelMsgId,
      role: "model",
      content: "",
      timestamp: new Date()
    }]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const userId = session?.user?.id;

      if (!token) throw new Error("Authentication missing");

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          scan_id: scanId,
          user_message: text,
          user_id: userId
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') break;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setMessages(prev => {
                    // Update only our active model placeholder
                    return prev.map(m => m.id === modelMsgId ? { ...m, content: accumulated } : m);
                  });
                } else if (parsed.error) {
                    console.error("Chat backend error:", parsed.error);
                    setMessages(prev => prev.map(m => 
                      m.id === modelMsgId 
                        ? { ...m, content: `Connection error: ${parsed.error}` } 
                        : m
                    ));
                }
              } catch (_) {}
            }
        }
      }
    } catch (e) {
        console.error("Error communicating with Agribot:", e);
        setMessages(prev => prev.map(m => 
            m.id === modelMsgId ? { ...m, content: "Sorry, I am having trouble connecting right now. Please try again." } : m
        ));
    } finally {
        setIsStreaming(false);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 z-[9999]">
      <ChatPanel 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isStreaming={isStreaming}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSend={() => handleSend(inputValue)}
        onSendText={handleSend}
        scanData={scanData}
      />
      {!isOpen && <FloatingButton onClick={() => setIsOpen(true)} />}
    </div>
  );
}
