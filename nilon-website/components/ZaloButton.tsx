'use client';

import { MessageSquare } from 'lucide-react';

export default function ZaloButton() {
  return (
    <div className="fixed bottom-[144px] right-5 z-50 flex items-center gap-2">
      <a
        href="https://zalo.me/0931982568"
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center gap-2 bg-[#2b6cb0] hover:bg-[#3182ce] text-white w-12 h-12 rounded-full justify-center shadow-xl transition-all transform hover:scale-110 active:scale-95 border border-[#63b3ed]/40"
        aria-label="Chat Zalo 0931982568"
        title="Chat Zalo Báo Giá: 0931982568"
      >
        <span className="absolute inset-0 rounded-full bg-[#2b6cb0] animate-ping opacity-40"></span>
        <MessageSquare className="w-5 h-5 text-white" />
      </a>
    </div>
  );
}
