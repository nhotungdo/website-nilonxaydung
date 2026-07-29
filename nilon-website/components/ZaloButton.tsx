'use client';

import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export default function ZaloButton() {
  return (
    <div className="fixed bottom-6 right-6 md:bottom-24 md:right-6 z-50 flex flex-col items-center gap-2">
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="bg-[#1a365d] text-white text-xs font-bold px-3 py-1.5 rounded-[12px] shadow-1 border border-[#63b3ed]/30 hidden md:block"
      >
        Nhắn Zalo Báo Giá!
      </motion.div>

      <a
        href="https://zalo.me/0931982568"
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
        aria-label="Chat Zalo"
      >
        {/* Pulse Effect */}
        <span className="absolute inset-0 rounded-[12px] bg-[#2b6cb0] animate-ping opacity-60"></span>

        <div className="relative bg-[#2b6cb0] text-white w-14 h-14 rounded-[12px] flex items-center justify-center shadow-2 hover:bg-[#3182ce] transition-all transform hover:scale-105 border border-[#63b3ed]/40">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
      </a>
    </div>
  );
}
