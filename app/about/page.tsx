import AboutHero from "@/components/AboutHero";
import OurBackground from "@/components/OurBackground";
import WhyChooseUs from "@/components/WhyChooseUs";
import WhyChooseStats from "@/components/WhyChooseStats";
import MissionAndQuestions from "@/components/MissionAndQuestions";

export default function AboutPage() {
  return (
    <div>
      <AboutHero />
      <OurBackground />
      {/* <WhyChooseUs /> */}
      <WhyChooseStats />
      <MissionAndQuestions />
    </div>
  );
}
