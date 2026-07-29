"use client";
import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuickQuoteModal from './QuickQuoteModal';

export default function FloatingQuoteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: 50 }}
            className="fixed bottom-24 right-6 z-[90] md:right-8 md:bottom-32"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center gap-2 bg-[#1a365d] hover:bg-[#2b6cb0] text-white p-4 rounded-[12px] shadow-2 transition-all hover:pr-6 border border-[#2b6cb0]/40"
            >
              <FileText className="w-6 h-6 text-[#63b3ed]" />
              <span className="max-w-0 overflow-hidden whitespace-nowrap font-bold text-sm transition-all group-hover:max-w-xs font-heading">
                Nhận báo giá ngay
              </span>
              
              {/* Pulse effect */}
              <span className="absolute inset-0 rounded-[12px] bg-[#2b6cb0] animate-ping opacity-20 -z-10"></span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickQuoteModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
