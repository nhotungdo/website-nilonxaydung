'use client';

import { motion } from 'framer-motion';

export default function ZaloButton() {
  return (
    <div className="fixed bottom-6 right-6 md:bottom-24 md:right-6 z-50 flex flex-col items-center gap-2">
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md border border-blue-100 hidden md:block"
      >
        Nhắn Zalo ngay!
      </motion.div>

      <a
        href="https://zalo.me/0931982568"
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
        aria-label="Chat Zalo"
      >
        {/* Pulse Effect */}
        <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75"></span>

        <div className="relative bg-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all transform hover:scale-110">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.047 3.01C7.82 3.01 4.388 5.432 4.388 8.42c0 1.636.945 3.093 2.417 4.103-.13.475-.465 1.705-.533 1.956-.1.353.116.34.243.257.1-.065 1.595-1.077 2.228-1.51.433.125.885.19 1.348.19 4.228 0 7.659-2.422 7.659-5.41 0-2.988-3.431-5.41-7.659-5.41l-.046-.006zm3.327 7.91l-1.396-1.53c-.11-.122-.16-.27-.14-.424l.115-.967c.02-.153.132-.284.286-.328.155-.044.318.006.425.122l1.396 1.53c.11.12.16.268.14.423l-.115.967c-.02.154-.132.285-.286.33-.153.04-.316-.01-.425-.125l-.015.002zm-3.327-1.53l-1.396-1.53c-.11-.122-.16-.27-.14-.424l.115-.967c.02-.153.132-.284.286-.328.155-.044.318.006.425.122l1.396 1.53c.11.12.16.268.14.423l-.115.967c-.02.154-.132.285-.286.33-.153.04-.316-.01-.425-.125l-.015.002zm-3.328 1.53l-1.396-1.53c-.11-.122-.16-.27-.14-.424l.115-.967c.02-.153.132-.284.286-.328.155-.044.318.006.425.122l1.396 1.53c.11.12.16.268.14.423l-.115.967c-.02.154-.132.285-.286.33-.153.04-.316-.01-.425-.125l-.015.002z" />
          </svg>
        </div>
      </a>
    </div>
  );
}
