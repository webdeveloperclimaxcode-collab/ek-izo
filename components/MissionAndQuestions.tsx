"use client";

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

export default function MissionAndQuestions() {
  const { theme } = useTheme();

  const questions = [
    {
      question: "Why does Izogrup services cost less than its competitors?",
      answer:
        "Because we import the materials directly from the first hand supplier. Izogrup does not enter into commercial agreements with third party companies. Also we have distribution points and staff teams in all major cities, this causes lowers fuel and transportation costs.",
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
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Our Mission */}
          <div>
            <h2 className="text-[36px] font-bold mb-6">
              <span className={`transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>OUR </span>
              <span className={`transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>MISSION</span>
            </h2>

            <p className={`text-[15px] leading-relaxed mb-8 transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
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
              className="inline-block px-12 py-4 bg-[#9F001B] text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-[16px]"
            >
              CONTACT US
            </Link>
          </div>

          {/* Right Column - Popular Questions */}
          <div>
            <h2 className="text-[36px] font-bold mb-6">
              <span className={`transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>POPULAR </span>
              <span className={`transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>QUESTIONS</span>
            </h2>

            <div className="space-y-4">
              {questions.map((item, index) => (
                <div key={index}>
                  {/* Question */}
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-[#9F001B] flex items-center justify-center mt-1">
                      <svg
                        width="8"
                        height="12"
                        viewBox="0 0 8 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.5 1L6.5 6L1.5 11"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className={`text-[15px] font-semibold leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#1B2556]"}`}>
                      {item.question}
                    </p>
                  </div>

                  {/* Answer (if exists) */}
                  {item.answer && (
                    <p className={`text-[14px] leading-relaxed mt-3 ml-9 transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
                      {item.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
