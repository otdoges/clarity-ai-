import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';

interface UserProfileProps {
  session: Session;
}

const UserProfile: React.FC<UserProfileProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = session.user;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
      >
        <img 
          src={user.user_metadata.avatar_url || `https://api.dicebear.com/6/initials/svg?seed=${user.email}`}
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-white font-medium hidden sm:block">{user.user_metadata.full_name || user.email}</span>
        <FiChevronDown className={`text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-50"
          >
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