'use client'

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
      inputRef.current?.focus();
      scrollToBottom();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
    setShowNewMessage(false);
  };

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const isNearBottom = scrollContainer.scrollHeight - scrollContainer.clientHeight <= scrollContainer.scrollTop + 50;
      setShowNewMessage(!isNearBottom && messages.length > 0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-4 bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-md">
        <motion.div
          className="relative w-40 h-40 mb-8"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {/* AI助手头像 */}
          <div className="absolute inset-0 bg-blue-400 rounded-full shadow-lg"></div>
          {/* 眼睛 */}
          <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-white rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-white rounded-full"></div>
          {/* 嘴巴 */}
          <motion.div 
            className="absolute bottom-1/4 left-1/2 w-16 h-2 bg-white rounded-full"
            style={{ translateX: '-50%' }}
            animate={{
              scaleX: [1, 0.8, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          ></motion.div>
          {/* 天线 */}
          <motion.div 
            className="absolute top-0 left-1/2 w-1 h-6 bg-blue-600 origin-bottom"
            style={{ translateX: '-50%' }}
            animate={{
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          ></motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-2 border-blue-300 rounded-full px-6 py-3 mb-4 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="输入消息..."
          />
          <button 
            onClick={handleSubmit}
            className="bg-blue-500 text-white w-full px-6 py-3 rounded-full hover:bg-blue-600 transition-colors transform hover:scale-105"
          >
            发送消息
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative w-full max-w-md h-80 mt-8 bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div 
          ref={scrollContainerRef} 
          className="h-full overflow-y-auto scrollbar-hide p-4"
          onScroll={handleScroll}
        >
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-100 p-3 mb-3 rounded-lg text-black"
            >
              {msg}
            </motion.div>
          ))}
        </div>
        {showNewMessage && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm shadow-md hover:bg-blue-600 transition-colors"
          >
            返回底部
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
