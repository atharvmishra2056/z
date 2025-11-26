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
        // FIX: Changed 'overflow-hidden' to 'overflow-x-hidden'
        // This allows the vertical sticky scroll in HowItWorks to function
        <main className="min-h-screen bg-void overflow-x-hidden relative selection:bg-brand-primary/30">
            
            {/* Floating Navbar */}
            <div className="fixed top-6 z-50 w-full flex justify-center pointer-events-none">
                 <div className="pointer-events-auto w-full">
                    <Navbar /> 
                 </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-8 space-y-24 lg:space-y-32 max-w-[1400px]">
                <HeroSection />
                <StatsSection />
                <GallerySection />
                <FeaturedCards />
                
                {/* This section now works because the parent isn't clipping vertical overflow */}
                <HowItWorks />
                
                <SupportCard />
                <Testimonials />
                <FAQSection />
            </div>
            
            <Footer />
        </main>
    );
}