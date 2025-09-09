"use client"

import { useState, useEffect } from "react"
import { Info } from 'lucide-react'
import axiosInstance from "@/lib/axiosInstance"
import useAuthStore from "@/context/AuthContext"

interface InfoPopupProps {
  message: string
  isVisible: boolean
  onClose: () => void
}

function convertMessage(message: string): string {
  return message
    .replace(/\r\n|\r|\n/g, "<br />") // دعم كل أنواع الـ newline
}

export default function InfoPopup({ message, isVisible, onClose }: InfoPopupProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const clearMessage = useAuthStore((state) => state.clearMessage)

  useEffect(() => {
    if (isVisible && message) {
      setIsAnimating(true)
    }
  }, [isVisible, message])

  const handleClose = async () => {
    setIsAnimating(false)
    setIsLoading(true)
    
    try {
      // إرسال API لإعلام الخادم أن الرسالة تم قراءتها
      const response = await axiosInstance.post("/user-read-message", {}, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error("Error sending message read API:", error);
      // حتى لو فشل الـ API، نستمر في إغلاق الـ popup
    } finally {
      // مسح الرسالة من الـ context
      clearMessage();
      setIsLoading(false);
      
      setTimeout(() => {
        onClose()
      }, 300)
    }
  }

  if (!isVisible || !message) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 transition-all duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(59,130,246,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(168,85,247,0.1) 0%, transparent 50%),
            linear-gradient(45deg, rgba(34,197,94,0.05) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(239,68,68,0.05) 25%, transparent 25%),
            rgba(0,0,0,0.4)
          `,
          backgroundSize: '100% 100%, 100% 100%, 20px 20px, 20px 20px, 100% 100%'
        }}
      />
      
      <div 
        className={`relative w-full max-w-md transform transition-all duration-500 ${
          isAnimating 
            ? 'scale-100 opacity-100 translate-y-0 rotate-0' 
            : 'scale-75 opacity-0 translate-y-8 rotate-3'
        }`}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-sm opacity-20"></div>
        
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-8 pt-8">
            <div className="relative mb-6 flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 scale-150 animate-pulse"></div>
              <div className="relative p-4 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                <Info className="w-16 h-16 text-blue-500" />
              </div>
            </div>
            
            <div className="text-center mb-8">
              <p 
                className="text-xl font-bold text-black leading-relaxed mb-2"
                dangerouslySetInnerHTML={{ __html: convertMessage(message) }}
              />
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="group relative px-8 py-3 bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative flex items-center gap-2">
                  {isLoading ? "جاري..." : "حسنًا"}
                </span>
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-30"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-30"></div>
        </div>
      </div>
    </div>
  )
}
