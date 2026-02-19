"use client";

import { useState } from "react";
import BlogHero from "../../components/BlogHero";
import BlogListing from "../../components/BlogListing";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  return (
    <div>
      <BlogHero
        searchQuery={searchQuery}
        selectedCategoryId={selectedCategory}
        selectedYear={selectedYear}
        onSearch={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onYearChange={setSelectedYear}
      />
      <BlogListing 
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedYear={selectedYear}
      />
    </div>
  );
}
