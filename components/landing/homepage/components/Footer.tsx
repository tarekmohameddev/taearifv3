'use client';

import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 pt-8 transform animate-slideUp ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
          {/* Logo Column */}
          <div className="hidden md:block">
            <Image
              src="logo.svg"
              alt="Taearif Logo"
              width={246}
              height={59}
              className="w-auto h-14"
            />
          </div>
          <div>
          </div>
          {/* Links Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">الروابط</h4>
            <ul className="space-y-2">
              <li>
                <a 
              href="/#home" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  الصفحة الرئيسية
                </a>
              </li>
              <li>
                <a 
                    href="#pricing"           
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  الباقات
                </a>
              </li>
              <li>
                <a href="/#about"  className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  نبذة عنا
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  سياسة الخصوصية وسرية المعلومات
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support Column */}
          {/* <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">المساعدة والدعم</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  المدونة
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  اتصل بنا
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  الدعم
                </a>
              </li>
            </ul>
          </div> */}

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">عنواننا</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  سعد بن أبي وقاص، الرياض المملكة العربية السعودية
                </a>
              </li>
              <li>
                <a href="mailto:info@taearif.com" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  info@taearif.com
                </a>
              </li>
              <li>
                <a href="tel:+966592960339" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  +966592960339
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section with Green Background */}
      <div className="bg-[#E7FDF2] mt-8 mx-5  pt-8 pb-8 text-center r">
        <div className="container mx-auto px-4">
          <p className="text-gray-700">
            © 2025 - تعاريف
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
