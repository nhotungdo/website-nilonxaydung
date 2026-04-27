"use client";

import { motion } from "framer-motion";

export default function ProductSkeleton() {
  return (
    <motion.div 
      className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative aspect-square bg-gray-200 animate-pulse"></div>
      
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        
        <div className="flex items-center justify-between pt-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
}
