"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const { theme } = useTheme();
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Outer rotating ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-4 transition-colors duration-300 border-t-(--brand-primary) ${theme === "dark"
            ? "border-gray-700 "
            : "border-gray-200 "
            } animate-spin`}
        ></div>

        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-2 h-2 rounded-full animate-pulse transition-colors duration-300 ${theme === "dark" ? "bg-[#ff4d6d]" : "bg-[#1B2556]"
            }`}></div>
        </div>
      </div>
    </div>
  );
}
