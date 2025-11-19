import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import GallerySection from "@/components/GallerySection";
import FeaturedCards from "@/components/FeaturedCards";
import HowItWorks from "@/components/HowItWorks";
import SupportCard from "@/components/SupportCard";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="min-h-screen bg-black overflow-hidden">
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24 lg:space-y-32 max-w-[1400px]">
                <HeroSection />
                <StatsSection />
                <GallerySection />
                <FeaturedCards />
                <HowItWorks />
                <SupportCard />
                <Testimonials />
                <FAQSection />
            </div>
            <Footer />
        </main>
    );
}