'use client'

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [showNewMessage, setShowNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale({
        x: 1 + Math.sin(Date.now() / 250) * 0.1,
        y: 1 + Math.cos(Date.now() / 250) * 0.05
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const isNearBottom = scrollContainer.scrollHeight - scrollContainer.clientHeight <= scrollContainer.scrollTop + 50; // 假设消息高度约为50px
        if (isNearBottom) {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          setShowNewMessage(false);
        } else {
          setShowNewMessage(true);
        }
      }
    }
  }, [messages]);

  const handleSubmit = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowNewMessage(false);
  };

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const isNearBottom = scrollContainer.scrollHeight - scrollContainer.clientHeight <= scrollContainer.scrollTop + 50;
      if (isNearBottom) {
        setShowNewMessage(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-4">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-40 h-36 mb-8">
          <div 
            className="absolute inset-0 bg-blue-300 transition-all duration-300 ease-in-out"
            style={{
              transform: `scale(${scale.x}, ${scale.y})`,
              borderRadius: '50%',
            }}
          />
          {/* 左眼 */}
          <div 
            className="absolute w-3 h-3 bg-black rounded-full transition-all duration-300 ease-in-out"
            style={{ 
              left: `calc(30% * ${scale.x})`, 
              top: `calc(40% * ${scale.y})`,
              transform: `translate(-50%, -50%) scale(${1 / ((scale.x + scale.y) / 2)})` 
            }} 
          />
          {/* 右眼 */}
          <div 
            className="absolute w-3 h-3 bg-black rounded-full transition-all duration-300 ease-in-out"
            style={{ 
              right: `calc(30% * ${scale.x})`, 
              top: `calc(40% * ${scale.y})`,
              transform: `translate(50%, -50%) scale(${1 / ((scale.x + scale.y) / 2)})` 
            }} 
          />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 rounded px-4 py-2 mb-4 w-64 text-black"
          placeholder="输入消息..."
        />
        <button 
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          提交
        </button>
      </div>
      <div className="relative w-64 h-60 mt-4">
        <div 
          ref={scrollContainerRef} 
          className="h-full overflow-y-auto scrollbar-hide"
          onScroll={handleScroll}
        >
          {messages.map((msg, index) => (
            <div key={index} className="bg-gray-100 p-2 mb-2 rounded text-black">
              {msg}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {showNewMessage && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm animate-bounce"
          >
            新消息
          </button>
        )}
      </div>
    </div>
  );
}
