import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Cpu, Zap, Crown } from 'lucide-react';

const models = [
  { id: 'llama3', name: 'Llama 3', icon: Cpu, tier: 'Pro' },
  { id: 'gpt4o', name: 'GPT-4o', icon: Crown, tier: 'Premium' },
  { id: 'claude3', name: 'Claude 3 Opus', icon: Zap, tier: 'Premium' },
  { id: 'gemini', name: 'Gemini Pro', icon: Cpu, tier: 'Pro' },
];

const ModelSelect: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const handleModelSelect = (model: typeof models[0]) => {
    setSelectedModel(model);
    setIsOpen(false);
  };

  return (
    <div className="relative z-30 model-selector" style={{ position: 'static' }}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel px-4 py-2 rounded-lg flex items-center space-x-3 hover:accent-glow transition-all duration-300 min-w-[180px]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <selectedModel.icon className="w-4 h-4 text-teal-400" />
        <span className="text-white font-medium">{selectedModel.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              className="absolute right-0 top-full mt-2 w-64 glass-panel rounded-lg border border-slate-700/50 overflow-hidden z-50"
              style={{ maxHeight: '300px', overflowY: 'auto' }}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {models.map((model, index) => (
                <motion.button
                  key={model.id}
                  onClick={() => handleModelSelect(model)}
                  className={`w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700/50 transition-colors duration-200 ${
                    selectedModel.id === model.id ? 'bg-slate-700/30' : ''
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-3">
                    <model.icon className="w-4 h-4 text-teal-400" />
                    <div className="text-left">
                      <div className="text-white font-medium">{model.name}</div>
                      <div className="text-xs text-slate-400">{model.tier}</div>
                    </div>
                  </div>
                  {selectedModel.id === model.id && (
                    <motion.div
                      className="w-2 h-2 accent-gradient rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModelSelect;