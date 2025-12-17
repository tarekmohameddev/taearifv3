import React from "react";
import ProjectCard from "./components/projectCard";
import ProjectCard2 from "./components/projectCard2";

interface Project {
  image: string;
  title: string;
  city: string;
  district: string;
  status: string; // يمكن أن يكون "للبيع" | "للإيجار" أو مدة مثل "3 أشهر" | "سنة" | "سنتين"
  area: {
    min: number;
    max: number;
  };
  rooms: {
    min: number;
    max: number;
  };
  units: number;
  floors: {
    min: number;
    max: number;
  };
  price: {
    min: number;
    max: number;
  };
  bathrooms?: {
    min: number;
    max: number;
  };
  featured?: boolean;
  url?: string;
}

interface ProjectsProps {
  title: string;
  projects: Project[];
  loadMoreButtonText: string;
  viewAllButtonText?: string;
  cardType?: "card1" | "card2"; // نوع البطاقة المستخدمة
}

export default function Projects({
  title,
  projects,
  loadMoreButtonText,
  viewAllButtonText = "عرض الكل",
  cardType = "card1",
}: ProjectsProps) {
  const CardComponent = cardType === "card2" ? ProjectCard2 : ProjectCard;

  return (
    <section className="py-12 px-4 bg-[#efe5dc]">
      <div className="container mx-auto max-w-7xl">
        {/* View All Button and Heading */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-right">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 text-gray-800">
              {title}
            </h3>
            {/* Divider */}
            <div className="w-24 h-[2px] bg-[#8b5f46] mb-4 ml-auto"></div>
          </div>
          <button className="flex items-center gap-2 text-[#8b5f46] font-medium hover:text-[#6b4630] transition-colors duration-300 text-md md:text-xl">
            <span>{viewAllButtonText}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <CardComponent key={index} {...project} />
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <button className="px-5 py-3 border-2 border-[#8b5f46] bg-transparent text-[#8b5f46] font-medium rounded-2xl transition-all duration-300 hover:bg-[#8b5f46] hover:text-white hover:scale-110">
            {loadMoreButtonText}
          </button>
        </div>
      </div>
    </section>
  );
}
