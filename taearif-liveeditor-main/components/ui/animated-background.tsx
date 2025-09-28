"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
      
      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0">
        {/* Large Circle */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Medium Circle */}
        <motion.div
          className="absolute top-1/4 -left-20 w-60 h-60 bg-gradient-to-br from-indigo-400/15 to-blue-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        {/* Small Circle */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        
        {/* Floating Squares */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-8 h-8 bg-blue-400/10 rounded-lg rotate-45"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [45, 90, 45],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-indigo-400/10 rounded-lg rotate-12"
          animate={{
            x: [0, -40, 0],
            y: [0, 25, 0],
            rotate: [12, 45, 12],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        
        {/* Floating Triangles */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-b-[20px] border-b-blue-400/10 border-r-[12px] border-r-transparent"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
      </div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>
    </div>
  );
}
