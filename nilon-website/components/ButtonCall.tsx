'use client';

import { Phone } from 'lucide-react';

export default function ButtonCall() {
  return (
    <a
      href="tel:0931982568"
      className="fixed bottom-[84px] right-5 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl hover:from-emerald-500 hover:to-teal-500 transition-all transform hover:scale-110 active:scale-95 border border-emerald-400/40 animate-bounce"
      aria-label="Gọi ngay 0931982568"
      title="Gọi Hotline ngay: 0931982568"
    >
      <Phone className="w-5 h-5 text-white" />
    </a>
  );
}
