'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

export default function GetStartedPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validatePhone = (phoneNumber: string) => {
    if (!phoneNumber.startsWith('05')) {
      return 'رقم الهاتف يجب أن يبدأ بـ 05';
    }
    if (phoneNumber.length !== 10) {
      return 'رقم الهاتف يجب أن يكون 10 أرقام';
    }
    return '';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
    if (value) {
      setPhoneError(validatePhone(value));
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone) {
      setMessage('الرجاء تعبئة جميع الحقول');
      return;
    }

    const phoneValidationError = validatePhone(phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/submit', {
        name,
        phone,
        event: 'معرض بروبتك للتقنيات العقارية',
        timestamp: new Date().toISOString()
      });

      if (response.data.success) {
        setMessage('تم التسجيل بنجاح! شكراً لك');
        setName('');
        setPhone('');
        setPhoneError('');
      } else {
        setMessage(response.data.error || 'حدث خطأ، الرجاء المحاولة مرة أخرى');
      }
    } catch (error) {
      setMessage('حدث خطأ، الرجاء المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" style={{ direction: 'rtl' }} className="min-h-screen bg-[#d7f7ec] text-black relative overflow-hidden flex flex-col items-center justify-between py-4 sm:py-6 md:py-8 px-4 sm:px-6 force-rtl">
      {/* Riyadh Skyline - Background */}
      <div className="absolute bottom-0 sm:right-0 w-[85%] md:w-[60%] lg:w-[50%] lg:w-[40%] h-[300px] pointer-events-none">
        <Image 
          src="/images/Riyadh.png" 
          alt="Riyadh Skyline" 
          fill
          className="object-contain object-bottom opacity-20"
          priority
        />
      </div>

      {/* Top Section - Logos */}
      <div className="w-full max-w-6xl relative z-10 mb-4 sm:mb-6 md:mb-8" dir="rtl">
        <div className="flex justify-start items-start" dir="rtl">

          {/* Right Logo - Taarif */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="relative w-[120px] h-[120px] sm:w-[144px] sm:h-[144px] md:w-[168px] md:h-[168px] cursor-pointer">
              <Image 
                src="/logo.svg" 
                alt="Taarif Logo" 
                width={168} 
                height={168}
                className="object-contain"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl w-full px-4 sm:px-6" dir="rtl">
        {/* Invitation Text */}
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed space-y-1 sm:space-y-2 font-['Cairo'] mb-8 sm:mb-10 md:mb-12" 
             style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
          <p>
            شكراً لزيارتك لنا في معرض <span className="text-orange-500 font-semibold">بروبتك</span> للتقنيات العقارية
          </p>
          <p>تفضل بتسجيل بياناتك</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4 sm:space-y-6" dir="rtl">
          {/* Name Input */}
          <div className="w-full">
            <label htmlFor="name" className="block text-right text-base sm:text-lg font-semibold mb-2 text-gray-800">
              الاسم <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              dir="rtl"
              className="w-full px-4 py-3 sm:py-4 text-right text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors bg-white text-gray-800"
              aria-required="true"
              disabled={loading}
            />
          </div>

          {/* Phone Input */}
          <div className="w-full">
            <label htmlFor="phone" className="block text-right text-base sm:text-lg font-semibold mb-2 text-gray-800">
              رقم الهاتف <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              required
              dir="rtl"
              placeholder="05xxxxxxxx"
              maxLength={10}
              className="w-full px-4 py-3 sm:py-4 text-right text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors bg-white text-gray-800"
              aria-required="true"
              disabled={loading}
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-2 text-right">{phoneError}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 sm:py-4 px-6 rounded-lg text-base sm:text-lg transition-colors duration-200 shadow-lg"
          >
            {loading ? 'جارٍ التسجيل...' : 'تسجيل'}
          </button>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg text-center text-base sm:text-lg ${
              message.includes('بنجاح') 
                ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                : 'bg-red-100 text-red-800 border-2 border-red-300'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Bottom Section - Event Details */}
      <div className="relative z-10 w-full max-w-4xl mt-6 sm:mt-8 md:mt-12 px-4 sm:px-6" dir="rtl">


      </div>
    </div>
  );
}

