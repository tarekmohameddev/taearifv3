import Hero2 from "@/components/AboutUs/hero2/hero2";
import MapSection from "@/components/contactUs/mapSection/mapSection";

export default function ContactUsPage() {
    return (
        <div className="min-h-screen">
            <div className="pb-[450px]">
                <Hero2
                title="تواصل معنا"
                backgroundImage="https://baheya.co/wp-content/uploads/2025/09/Screenshot-2025-09-21-005950.png"
                contact={true} />
            </div>
            <MapSection />
        </div>
    )
}
