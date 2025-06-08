import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { FiSettings, FiLogOut, FiChevronDown, FiUser } from 'react-icons/fi';

interface UserProfileProps {
  session: Session;
}

const UserProfile: React.FC<UserProfileProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = session.user;
  
  // Get display name from user metadata or email
  const displayName = user.user_metadata?.full_name || 
                     user.user_metadata?.name || 
                     user.email?.split('@')[0] || 
                     'User';

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 glass-panel"
      >
        <div className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center overflow-hidden">
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <FiUser className="text-white" />
          )}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-white font-medium text-sm">
            {displayName}
          </span>
          <span className="text-teal-400 text-xs">
            Signed in
          </span>
        </div>
        <FiChevronDown className={`text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-48 glass-panel rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-slate-700/50">
              <p className="text-white font-medium">{displayName}</p>
              <p className="text-gray-400 text-xs truncate">{user.email}</p>
            </div>
            <ul className="text-gray-300">
              <li>
                <a href="#" className="flex items-center px-4 py-2 hover:bg-white/10">
                  <FiSettings className="mr-2" />
                  Settings
                </a>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 hover:bg-white/10"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile; 