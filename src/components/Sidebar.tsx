import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Archive, Clock, Trash2 } from 'lucide-react';
import type { Chat } from '../App';

interface SidebarProps {
  isOpen: boolean;
  chats: Chat[];
  activeChatId: number;
  onNewChat: () => void;
  onSelectChat: (chatId: number) => void;
  onDeleteChat: (chatId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  chats, 
  activeChatId, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat 
}) => {
  const [hoveredChatId, setHoveredChatId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const handleDeleteClick = (e: React.MouseEvent, chatId: number) => {
    e.stopPropagation();
    setShowDeleteConfirm(chatId);
  };

  const confirmDelete = (chatId: number) => {
    onDeleteChat(chatId);
    setShowDeleteConfirm(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="w-80 glass-panel border-r border-slate-700/50 flex flex-col relative overflow-hidden"
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.4, 0, 0.2, 1] 
          }}
        >
          {/* Animated Background Gradient */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              background: 'linear-gradient(135deg, rgba(56, 178, 172, 0.1) 0%, rgba(94, 124, 226, 0.1) 100%)'
            }}
            animate={{
              background: [
                'linear-gradient(135deg, rgba(56, 178, 172, 0.1) 0%, rgba(94, 124, 226, 0.1) 100%)',
                'linear-gradient(135deg, rgba(94, 124, 226, 0.1) 0%, rgba(56, 178, 172, 0.1) 100%)',
                'linear-gradient(135deg, rgba(56, 178, 172, 0.1) 0%, rgba(94, 124, 226, 0.1) 100%)'
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Sidebar Header */}
          <motion.div 
            className="p-6 border-b border-slate-700/50 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <motion.button
              onClick={onNewChat}
              className="w-full glass-panel px-4 py-3 rounded-lg flex items-center space-x-3 hover:accent-glow transition-all duration-300 group"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4, type: "spring", stiffness: 200 }}
            >
              <motion.div
                className="w-5 h-5 accent-gradient rounded flex items-center justify-center"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Plus className="w-3 h-3 text-white" />
              </motion.div>
              <span className="text-white font-medium group-hover:text-teal-300 transition-colors duration-200">
                New Chat
              </span>
              <motion.div
                className="ml-auto w-2 h-2 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </motion.div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 relative z-10">
            <AnimatePresence mode="popLayout">
              {chats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  layout
                  className={`group cursor-pointer p-3 rounded-lg transition-all duration-300 relative overflow-hidden ${
                    chat.id === activeChatId 
                      ? 'bg-slate-700/40 border-l-2 border-teal-400' 
                      : 'hover:bg-slate-700/30'
                  }`}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ 
                    delay: 0.3 + (index * 0.05), 
                    duration: 0.4,
                    layout: { duration: 0.3 }
                  }}
                  whileHover={{ x: 4, scale: 1.02 }}
                  onClick={() => onSelectChat(chat.id)}
                  onHoverStart={() => setHoveredChatId(chat.id)}
                  onHoverEnd={() => setHoveredChatId(null)}
                >
                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-lg opacity-0"
                    animate={{ opacity: hoveredChatId === chat.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="flex items-start space-x-3 relative z-10">
                    <motion.div
                      className="mt-1 flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm font-medium truncate">
                        {chat.title}
                      </h3>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-500">
                          {formatTimestamp(chat.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <AnimatePresence>
                      {hoveredChatId === chat.id && chats.length > 1 && (
                        <motion.button
                          onClick={(e) => handleDeleteClick(e, chat.id)}
                          className="p-1 rounded hover:bg-red-500/20 transition-colors duration-200"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Active Chat Indicator */}
                  {chat.id === activeChatId && (
                    <motion.div
                      className="absolute left-0 top-0 w-1 h-full accent-gradient rounded-r"
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sidebar Footer */}
          <motion.div 
            className="p-4 border-t border-slate-700/50 space-y-2 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <motion.button
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-700/30 transition-all duration-200 group"
              whileHover={{ x: 4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Archive className="w-4 h-4 text-slate-400 group-hover:text-teal-400" />
              </motion.div>
              <span className="text-slate-300 text-sm group-hover:text-white transition-colors duration-200">
                Archived Chats
              </span>
            </motion.button>
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteConfirm(null)}
              >
                <motion.div
                  className="glass-panel p-6 rounded-lg border border-slate-700/50 max-w-sm mx-4"
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-white font-medium mb-2">Delete Chat?</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    This action cannot be undone. The chat and all its messages will be permanently deleted.
                  </p>
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="flex-1 px-4 py-2 rounded-lg glass-panel hover:bg-slate-700/50 text-white transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={() => confirmDelete(showDeleteConfirm)}
                      className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;