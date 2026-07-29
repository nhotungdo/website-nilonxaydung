'use client';

import { Phone } from 'lucide-react';

export default function ButtonCall() {
  return (
    <a
      href="tel:0931982568"
      className="fixed bottom-24 right-6 md:bottom-6 md:right-6 bg-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all z-50 animate-bounce border border-blue-400/40"
      aria-label="Gọi ngay"
    >
      <Phone className="w-6 h-6" />
    </a>
  );
}
