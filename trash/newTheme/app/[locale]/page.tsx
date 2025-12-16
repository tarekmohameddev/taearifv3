import Image from "next/image";
import Hero1 from "@/components/homepage/hero";
import Projects from "@/components/homepage/projects/projects";
import HalfAndHalf from "@/components/homepage/halfAnHalf/halfAnHalf";
import HalfAndHalf2 from "@/components/homepage/halfAnHalf/halfAnHalf2";
import ContactUsHomePage from "@/components/homepage/contactUsHomePage/contactUsHomePage";
import ImageText from "@/components/homepage/imageText/imageText";

// Projects data
const projectsData = [
  {
    image: "https://baheya.co/wp-content/uploads/2025/09/Screenshot-2025-09-21-005950.png",
    title: "تاون هاوس المحمدية",
    city: "مدينة الرياض",
    district: "حي المحمدية",
    status: "للبيع" as const,
    area: {
      min: 242,
      max: 273,
    },
    rooms: {
      min: 3,
      max: 3,
    },
    units: 5,
    floors: {
      min: 3,
      max: 3,
    },
    price: {
      min: 3050000,
      max: 3300000,
    },
    featured: true,
    url: "/properties/townhouse-al-mohammadiyah",
  },
  {
    image: "https://baheya.co/wp-content/uploads/2025/09/Screenshot-2025-09-21-005950.png",
    title: "شقق فاخرة في النرجس",
    city: "مدينة الرياض",
    district: "حي النرجس",
    status: "للبيع" as const,
    area: {
      min: 180,
      max: 220,
    },
    rooms: {
      min: 2,
      max: 3,
    },
    units: 12,
    floors: {
      min: 2,
      max: 2,
    },
    price: {
      min: 2500000,
      max: 2800000,
    },
    featured: false,
    url: "/properties/luxury-apartments-al-narjis",
  },
  {
    image: "https://baheya.co/wp-content/uploads/2025/09/Screenshot-2025-09-21-005950.png",
    title: "فلل راقية في الياسمين",
    city: "مدينة الرياض",
    district: "حي الياسمين",
    status: "للإيجار" as const,
    area: {
      min: 350,
      max: 450,
    },
    rooms: {
      min: 4,
      max: 5,
    },
    units: 8,
    floors: {
      min: 2,
      max: 3,
    },
    price: {
      min: 120000,
      max: 150000,
    },
    featured: true,
    url: "/properties/luxury-villas-al-yasmin",
  },
];

// Off-plan sale projects data (البيع على الخارطة)
const offPlanProjectsData = [
  {
    image: "https://baheya.co/wp-content/uploads/2025/09/9ddc69660c32566b22cb77d214f1a0ff.jpg",
    title: "أراضي شمس الرياض",
    city: "مدينة الرياض",
    district: "حي شمس الرياض",
    status: "3 أشهر",
    area: {
      min: 350,
      max: 5946,
    },
    rooms: {
      min: 0,
      max: 0,
    },
    units: 7,
    floors: {
      min: 0,
      max: 0,
    },
    price: {
      min: 1920000,
      max: 54708444,
    },
    featured: true,
    url: "/off-plan-sale/aradi-shams-al-riyadh",
  },
  {
    image: "https://baheya.co/wp-content/uploads/2025/08/Screenshot-2025-08-14-085718.png",
    title: "NEPTUNE INTERIORS",
    city: "مدينة الرياض",
    district: "حي سدرة",
    status: "سنتين",
    area: {
      min: 381,
      max: 447,
    },
    rooms: {
      min: 5,
      max: 5,
    },
    units: 5,
    floors: {
      min: 2,
      max: 2,
    },
    price: {
      min: 1920000,
      max: 7226913,
    },
    featured: true,
    url: "/off-plan-sale/neptune-interiors",
  },
  {
    image: "https://baheya.co/wp-content/uploads/2025/08/Screenshot-2025-08-14-022222.png",
    title: "Trump Tower",
    city: "مدينة جدة",
    district: "حي الزهراء",
    status: "4 سنوات",
    area: {
      min: 2,
      max: 303,
    },
    rooms: {
      min: 1,
      max: 4,
    },
    units: 23,
    floors: {
      min: 47,
      max: 47,
    },
    price: {
      min: 1920000,
      max: 15178000,
    },
    featured: true,
    url: "/off-plan-sale/trump-tower",
  },
];

// Featured individuals data (الأفراد المميزة)
const featuredIndividualsData = [
  {
    image: "https://baheya.co/wp-content/uploads/2025/08/PHOTO-2025-08-14-00-28-05.jpg",
    title: "بنتهاوس",
    city: "مدينة الرياض",
    district: "حي النرجس",
    status: "للبيع",
    area: {
      min: 231,
      max: 231,
    },
    rooms: {
      min: 3,
      max: 3,
    },
    units: 1,
    floors: {
      min: 1,
      max: 1,
    },
    price: {
      min: 2565000,
      max: 2565000,
    },
    bathrooms: {
      min: 3,
      max: 3,
    },
    featured: true,
    url: "/individuals/penthouse",
  },
  {
    image: "https://baheya.co/wp-content/uploads/2025/08/PHOTO-2025-08-14-00-13-43-3.jpg",
    title: "تاون هاوس",
    city: "مدينة الرياض",
    district: "حي النرجس",
    status: "للبيع",
    area: {
      min: 224,
      max: 224,
    },
    rooms: {
      min: 4,
      max: 4,
    },
    units: 1,
    floors: {
      min: 2,
      max: 2,
    },
    price: {
      min: 2565000,
      max: 2565000,
    },
    bathrooms: {
      min: 3,
      max: 3,
    },
    featured: true,
    url: "/individuals/townhouse",
  },
  {
    image: "https://baheya.co/wp-content/uploads/2025/07/PHOTO-2025-08-13-22-14-01.jpg",
    title: "فيلا 01",
    city: "مدينة الرياض",
    district: "حي النرجس",
    status: "للبيع",
    area: {
      min: 312,
      max: 312,
    },
    rooms: {
      min: 5,
      max: 5,
    },
    units: 1,
    floors: {
      min: 2,
      max: 2,
    },
    price: {
      min: 3850000,
      max: 3850000,
    },
    bathrooms: {
      min: 3,
      max: 3,
    },
    featured: false,
    url: "/individuals/villa-01",
  },
];

export default function Home() {
  return (
    <div>
      <Hero1 />
      <Projects
        title="المشـاريــع"
        projects={projectsData}
        loadMoreButtonText="عرض المزيد من العقارات"
        viewAllButtonText="عرض الكل"
      />
      <Projects
        title="البيع على الخارطة"
        projects={offPlanProjectsData}
        loadMoreButtonText="عرض المزيد من البيع على الخريطة"
        viewAllButtonText="عرض الكل"
      />
      <Projects
        title="الأفراد المميزة"
        projects={featuredIndividualsData}
        loadMoreButtonText="عرض المزيد من الأفراد"
        viewAllButtonText="عرض الكل"
        cardType="card2"
      />
      <HalfAndHalf />
      <ContactUsHomePage />
      <HalfAndHalf2 />
      <ImageText />
    </div>
  );
}
