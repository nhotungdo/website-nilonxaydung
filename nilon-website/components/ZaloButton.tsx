'use client';

export default function ZaloButton() {
  return (
    <a
      href="https://zalo.me/0901234567"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 md:bottom-24 md:right-6 bg-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all z-50"
      aria-label="Chat Zalo"
    >
      <span className="font-bold text-xl">Zalo</span>
    </a>
  );
}
