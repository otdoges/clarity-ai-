import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Brain, Sparkles } from 'lucide-react';
import ModelSelect from './ModelSelect';
import UserProfile from './UserProfile';
import { Session } from '@supabase/supabase-js';

interface HeaderProps {
  onToggleSidebar: () => void;
  session: Session | null;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, session }) => {
  return (
    <motion.header 
      className="glass-panel border-b border-slate-700/50 px-6 py-4 flex items-center justify-between relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-teal-400/30 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="flex items-center space-x-4 relative z-10">
        <motion.button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg glass-panel hover:accent-glow transition-all duration-300 group"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: "spring", stiffness: 200 }}
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Menu className="w-5 h-5 text-white group-hover:text-teal-300" />
          </motion.div>
        </motion.button>
        
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            className="w-8 h-8 accent-gradient rounded-lg flex items-center justify-center pulse-glow relative overflow-hidden"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            whileHover={{ scale: 1.1 }}
          >
            <Brain className="w-5 h-5 text-white relative z-10" />
            
            {/* Sparkle Effect */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
          
          <motion.h1 
            className="text-xl font-bold text-white tracking-tight"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Clarity AI
          </motion.h1>
          
          {/* Animated Sparkles */}
          <motion.div
            className="flex items-center space-x-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-3 h-3 text-teal-400" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center space-x-4"
      >
        <ModelSelect />
        {session && <UserProfile session={session} />}
      </motion.div>
    </motion.header>
  );
};

export default Header;