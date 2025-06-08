import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, User, Brain, Check, Sparkles } from 'lucide-react';
import { Message } from '../App';

interface MessageItemProps {
  message: Message;
  isStreaming?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isStreaming = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [showCaret, setShowCaret] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isStreaming && message.role === 'assistant') {
      setShowCaret(true);
      let i = 0;
      const interval = setInterval(() => {
        if (i < message.content.length) {
          setDisplayedContent(message.content.slice(0, i + 1));
          i++;
        } else {
          setShowCaret(false);
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    } else {
      setDisplayedContent(message.content);
      setShowCaret(false);
    }
  }, [message.content, isStreaming, message.role]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const isUser = message.role === 'user';

  return (
    <motion.div
      className={`flex items-start space-x-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Enhanced Avatar */}
      <motion.div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden ${
          isUser 
            ? 'bg-slate-600' 
            : 'accent-gradient pulse-glow'
        }`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.3, 
          type: "spring", 
          stiffness: 200,
          delay: 0.1
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <>
            <Brain className="w-4 h-4 text-white relative z-10" />
            {/* Sparkle Animation for AI */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 70%)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </motion.div>

      {/* Enhanced Message Content */}
      <motion.div
        className={`flex-1 max-w-3xl ${isUser ? 'text-right' : ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.div
          className={`glass-panel p-4 rounded-lg relative overflow-hidden ${
            isUser 
              ? 'bg-slate-700/40 ml-auto' 
              : 'bg-slate-800/40'
          }`}
          whileHover={{ scale: 1.01, y: -2 }}
          transition={{ duration: 0.2 }}
          layout
        >
          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5 rounded-lg"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.p 
            className="text-white leading-relaxed relative z-10"
            layout
          >
            {displayedContent}
            {showCaret && (
              <motion.span 
                className="shimmer-caret text-teal-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                |
              </motion.span>
            )}
          </motion.p>
          
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400 relative z-10">
            <span>{message.createdAt?.toLocaleTimeString()}</span>
            {isStreaming && !isUser && (
              <motion.div
                className="flex items-center space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="w-3 h-3 text-teal-400" />
                <span className="text-teal-400">Generating...</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Action Buttons (AI messages only) */}
        {!isUser && (
          <AnimatePresence>
            {isHovered && !isStreaming && (
              <motion.div
                className="flex items-center space-x-2 mt-2"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.2, staggerChildren: 0.05 }}
              >
                <motion.button
                  onClick={handleCopy}
                  className="glass-panel px-3 py-1.5 rounded-md flex items-center space-x-2 hover:accent-glow transition-all duration-200 group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <motion.div
                    animate={copied ? { scale: [1, 1.2, 1], rotate: [0, 10, 0] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400 group-hover:text-teal-400" />
                    )}
                  </motion.div>
                  <span className={`text-xs transition-colors duration-200 ${
                    copied ? 'text-green-400' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {copied ? 'Copied!' : 'Copy'}
                  </span>
                </motion.button>
                
                <motion.button
                  className="glass-panel px-3 py-1.5 rounded-md flex items-center space-x-2 hover:accent-glow transition-all duration-200 group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RefreshCw className="w-3 h-3 text-slate-400 group-hover:text-teal-400" />
                  </motion.div>
                  <span className="text-xs text-slate-300 group-hover:text-white transition-colors duration-200">
                    Regenerate
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MessageItem;