import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MessageItem from './MessageItem';
import { Message } from '../App';

interface MessageListProps {
  messages: Message[];
  isGenerating: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isGenerating }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="h-full overflow-y-auto px-6 py-6 space-y-6 flex flex-col"
    >
      <div className="flex-1">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              ease: "easeOut" 
            }}
            layout
            className="mb-6"
          >
            <MessageItem 
              message={message} 
              isStreaming={isGenerating && index === messages.length - 1 && message.role === 'assistant'}
            />
          </motion.div>
        ))}
        
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 accent-gradient rounded-full flex items-center justify-center pulse-glow">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-teal-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MessageList;