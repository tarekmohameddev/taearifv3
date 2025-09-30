'use client';

import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function SolutionsFooter() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <svg version="1.0" width="120" height="80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 565.000000 162.000000" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,162.000000) scale(0.100000,-0.100000)" fill="#FFFFFF" stroke="none">
                  <path d="M4182 1488 c-17 -17 -17 -1279 0 -1296 9 -9 128 -12 473 -12 l460 0
                  188 188 187 187 0 457 c0 402 -2 458 -16 472 -14 14 -86 16 -648 16 -478 0
                  -635 -3 -644 -12z m1030 -265 c17 -15 18 -37 18 -270 l0 -253 -112 0 c-150 0
                  -148 2 -148 -147 l0 -113 -140 0 -140 0 0 110 c0 97 -2 112 -20 130 -18 18
                  -33 20 -130 20 l-110 0 0 260 c0 236 2 260 18 269 10 7 152 11 381 11 325 0
                  366 -2 383 -17z"></path>
                  <path d="M837 1274 c-4 -4 -7 -43 -7 -86 l0 -78 95 0 96 0 -3 83 -3 82 -85 3
                  c-47 1 -89 0 -93 -4z"></path>
                </g>
              </svg>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              منصة تعاريف هي الحل الشامل لإدارة أعمالك العقارية بكفاءة واحترافية عالية
            </p>
            <div className="flex gap-4">
              <a href="https://snapchat.com/t/WRXySyZi" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                <i className="fa-brands fa-snapchat h-5"></i>
              </a>
              <a href="https://www.facebook.com/share/1HZffKAhn2/" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/taearif1" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@taearif" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                <i className="fa-brands fa-tiktok h-5"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">الرئيسية</a></li>
              <li><a href="/solutions" className="text-gray-300 hover:text-white transition-colors">الحلول</a></li>
              <li><a href="/about-us" className="text-gray-300 hover:text-white transition-colors">من نحن</a></li>
              <li><a href="/updates" className="text-gray-300 hover:text-white transition-colors">التحديثات</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors">سياسة الخصوصية</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>info@taearif.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+966592960339</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 تعاريف. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
