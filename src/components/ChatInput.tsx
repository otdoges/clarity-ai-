import React, { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Square, Paperclip, Mic, Zap } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
  onStopGeneration: () => void;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isGenerating, 
  onStopGeneration,
  input,
  setInput
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(input.length > 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isGenerating) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="pb-4 px-6">
      <motion.form
        onSubmit={handleSubmit}
        className={`glass-panel rounded-2xl p-4 transition-all duration-500 relative overflow-hidden ${
          isFocused ? 'accent-glow border-teal-400/50' : 'border-slate-700/50'
        }`}
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ duration: 0.2 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: isFocused 
              ? [
                  'linear-gradient(45deg, rgba(56, 178, 172, 0.1) 0%, rgba(94, 124, 226, 0.1) 100%)',
                  'linear-gradient(45deg, rgba(94, 124, 226, 0.1) 0%, rgba(56, 178, 172, 0.1) 100%)',
                  'linear-gradient(45deg, rgba(56, 178, 172, 0.1) 0%, rgba(94, 124, 226, 0.1) 100%)'
                ]
              : 'linear-gradient(45deg, transparent 0%, transparent 100%)'
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="flex items-end space-x-4 relative z-10">
          {/* Attachment Button */}
          <motion.button
            type="button"
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Paperclip className="w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors duration-200" />
          </motion.button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <motion.textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Message Clarity AI..."
              className="w-full bg-transparent text-white placeholder-slate-400 resize-none outline-none min-h-[20px] max-h-32 leading-6"
              rows={1}
              animate={{
                scale: isFocused ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  className="absolute -bottom-6 left-0 flex items-center space-x-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <Zap className="w-3 h-3 text-teal-400" />
                  <span className="text-xs text-teal-400">AI is ready to respond...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Voice Input Button */}
          <motion.button
            type="button"
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
            whileHover={{ scale: 1.1, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <motion.div
              animate={isFocused ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Mic className="w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors duration-200" />
            </motion.div>
          </motion.button>

          {/* Send/Stop Button */}
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.button
                key="stop"
                type="button"
                onClick={onStopGeneration}
                className="relative w-10 h-10 accent-gradient rounded-lg flex items-center justify-center overflow-hidden"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Square className="w-4 h-4 text-white relative z-10" />
                
                {/* Animated Progress Ring */}
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.3) 360deg)'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                />
                
                {/* Pulsing Glow */}
                <motion.div
                  className="absolute inset-0 rounded-lg bg-white/20"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.button>
            ) : (
              <motion.button
                key="send"
                type="submit"
                disabled={!input.trim()}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                  input.trim()
                    ? 'accent-gradient hover:accent-glow'
                    : 'bg-slate-700/50 cursor-not-allowed'
                }`}
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -90 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                whileHover={input.trim() ? { scale: 1.05 } : {}}
                whileTap={input.trim() ? { scale: 0.95 } : {}}
              >
                <Send className="w-4 h-4 text-white relative z-10" />
                
                {/* Shimmer Effect on Hover */}
                {input.trim() && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.form>

      {/* Enhanced Input Hint */}
      <motion.div
        className="flex items-center justify-center space-x-4 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <motion.p
          className="text-center text-xs text-slate-500"
          whileHover={{ scale: 1.05, color: '#38B2AC' }}
          transition={{ duration: 0.2 }}
        >
          Press Enter to send, Shift + Enter for new line
        </motion.p>
        
        {/* Animated Dots */}
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-slate-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ChatInput;