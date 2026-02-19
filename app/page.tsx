import HeroSection from "@/components/HeroSection";
import OurServices from "@/components/OurServices";
import CostOfServices from "@/components/CostOfServices";
import OurProducts from "@/components/OurProducts";
import FeaturedProducts from "@/components/FeaturedProducts";
import OurProjects from "@/components/OurProjects";
import VideoTutorial from "@/components/VideoTutorial";
import AboutUs from "@/components/AboutUs";
import WhyChoose from "@/components/WhyChoose";
import NewsBlogs from "@/components/NewsBlogs";
import WeWorkWith from "@/components/WeWorkWith";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <OurServices />
      <CostOfServices />
      <OurProducts />
      <FeaturedProducts />
      <OurProjects />
      <VideoTutorial />
      <AboutUs />
      <WhyChoose />
      <NewsBlogs />
      <WeWorkWith />
    </div>
  );
}
