"use client";

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
export default function MissionAndQuestions() {
  const { theme } = useTheme();

  const questions = [
    {
      question: "Why does Ekgrup services cost less than its competitors?",
      answer:
        "Because we import the materials directly from the first hand supplier. Ekgrup does not enter into commercial agreements with third party companies. Also we have distribution points and staff teams in all major cities, this causes lowers fuel and transportation costs.",
    },
    {
      question: "What is the timeline for the project?",
      answer: "",
    },
    {
      question:
        "What is the total budget for a waterproofing or thermal insulation project?",
      answer: "",
    },
    {
      question:
        "How is a waterproofing or thermal insulation project initiated?",
      answer: "",
    },
  ];

  return (
    <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-[#F5F7FA]"}`}>
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20  mx-auto">
        <div className="grid grid-cols-1 lg:flex gap-12 lg:gap-16">
          {/* Left Column - Our Mission */}
          <div className="lg:w-2/3">
            <h2 className="text-[36px] font-bold mb-6">
              <span className={`transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>OUR </span>
              <span className={`transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>MISSION</span>
            </h2>

            <p className={`text-[15px] lg:text-2xl  leading-relaxed mb-8 transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
              We have achieved key objectives such as nationwide coverage,
              modern equipment, reliable transport, and secure raw materials.
              The company remains focused on expanding its workforce and
              ensuring strong working conditions, because employee satisfaction
              directly reflects in client satisfaction. Creating new job
              opportunities and continually improving economic and workplace
              security for our team are central priorities — a satisfied
              employee always leads to a satisfied client.
            </p>

            <Link
              href="/contact"
              className="inline-block px-12 py-5  text-black dark:text-white font-medium rounded-full hover:opacity-90 transition-opacity text-2xl border border-[#F6BA40]"
            >
              {useLanguage().t("Contact Us")}
            </Link>
          </div>

          {/* Right Column - Popular Questions */}
          <div className="lg:w-1/3">
            <div className="relative w-full  h-[400px] lg:h-[480px] flex-shrink-0">
              <Image
                src="/assets/images/about/our_background.png"
                alt="EK Group Contacts"
                fill
                quality={100}
                className="object-cover rounded-3xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
