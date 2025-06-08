import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useChat, Message } from 'ai/react';

export type { Message };

export interface Chat {
  id: number;
  title: string;
  timestamp: Date;
  messages: Array<{
    id: number;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Create a dummy chat when component first mounts
  useEffect(() => {
    if (chats.length === 0) {
      const initialChat: Chat = {
        id: Date.now(),
        title: 'New Conversation',
        timestamp: new Date(),
        messages: []
      };
      
      setChats([initialChat]);
      setActiveChatId(initialChat.id);
    }
  }, []);

  const { messages, append, stop, isLoading, input, setInput } = useChat({
    api: 'http://localhost:3001/api/chat',
    id: session?.user?.id || 'anonymous-user',
    initialMessages: [
      {
        id: 'welcome-message',
        content: 'Hello! I\'m Clarity AI. Ask me anything to get started! 👋',
        role: 'assistant'
      }
    ],
    body: {
      userId: session?.user?.id || 'anonymous-user',
      chatId: activeChatId,
    },
    onFinish: () => {
      // If user has interacted but is not logged in, show auth modal
      if (hasInteracted && !session) {
        setTimeout(() => {
          setShowAuthModal(true);
        }, 1000); // Wait a moment after the AI finishes responding
      }
    }
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setShowAuthModal(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const activeChat = chats.find(chat => chat.id === activeChatId);

  const handleSendMessage = (content: string) => {
    if (!activeChat) return;
    
    // Mark that the user has interacted
    setHasInteracted(true);
    
    append({ content, role: 'user' });
  };

  const handleNewChat = () => {
    // Only allow new chats for logged-in users
    if (!session) {
      setShowAuthModal(true);
      return;
    }
    
    const newChat: Chat = {
      id: Date.now(),
      title: 'New Chat',
      timestamp: new Date(),
      messages: []
    };
    
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleDeleteChat = (chatId: number) => {
    // Only allow chat deletion for logged-in users
    if (!session) {
      setShowAuthModal(true);
      return;
    }
    
    setChats(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);
      if (chatId === activeChatId && filtered.length > 0) {
        setActiveChatId(filtered[0].id);
      } else if (filtered.length === 0) {
        setActiveChatId(null);
      }
      return filtered;
    });
  };

  const handleSelectChat = (chatId: number) => {
    // Only allow chat selection for logged-in users
    if (!session && chatId !== chats[0]?.id) {
      setShowAuthModal(true);
      return;
    }
    
    setActiveChatId(chatId);
  };

  return (
    <motion.div 
      className="h-screen flex overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{ height: '100vh', minHeight: '-webkit-fill-available' }}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none aurora-bg">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-500/15 to-blue-500/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/15 to-teal-500/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(session || sidebarOpen) && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="h-screen"
          >
            <Sidebar 
              isOpen={sidebarOpen} 
              chats={chats}
              activeChatId={activeChatId ?? -1}
              onNewChat={handleNewChat}
              onSelectChat={handleSelectChat}
              onDeleteChat={handleDeleteChat}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        className="flex-1 flex flex-col relative h-full"
        animate={{ 
          marginLeft: sidebarOpen ? 0 : 0 
        }}
        transition={{ 
          duration: 0.5, 
          ease: [0.4, 0, 0.2, 1] 
        }}
      >
        {/* Header - Fixed at top */}
        <div className="sticky top-0 z-50">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} session={session} />
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10 mt-0">
          <MessageList 
            messages={messages} 
            isGenerating={isLoading}
          />
        </div>

        {/* Chat Input */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.5, 
            ease: "easeOut" 
          }}
          className="relative z-10"
        >
          <ChatInput 
            onSendMessage={handleSendMessage}
            isGenerating={isLoading}
            onStopGeneration={stop}
            input={input}
            setInput={setInput}
          />
        </motion.div>
      </motion.div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && !session && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAuthModal(false);
              }
            }}
          >
            <motion.div
              className="w-full max-w-md p-8 rounded-2xl bg-gray-800/90 backdrop-blur-md shadow-2xl border border-gray-700/50"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300 
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-2 text-white text-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">
                    Continue the Conversation
                  </span>
                </h2>
                <p className="text-gray-300 text-center mb-6">
                  Sign in to save your chats, access history, and unlock all features
                </p>
                <div className="space-y-4">
                  <Auth
                    supabaseClient={supabase}
                    appearance={{ 
                      theme: ThemeSupa,
                      style: {
                        button: {
                          borderRadius: '8px',
                          backgroundColor: '#38B2AC',
                          padding: '10px',
                          transition: 'all 0.2s ease',
                        },
                        input: {
                          borderRadius: '8px',
                          backgroundColor: 'rgba(30, 41, 59, 0.5)',
                          border: '1px solid rgba(100, 116, 139, 0.3)',
                          color: 'white',
                          padding: '10px'
                        }
                      }
                    }}
                    providers={['github']}
                    theme="dark"
                  />
                  <div className="flex justify-center mt-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-gray-400 text-sm hover:text-teal-400 transition-colors"
                      onClick={() => setShowAuthModal(false)}
                    >
                      Continue as guest (limited features)
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default App;