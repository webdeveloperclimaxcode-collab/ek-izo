"use client";

import { useState } from "react";
import ServicesHero from '@/components/ServicesHero'
import ServicesListing from '@/components/ServicesListing'

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <ServicesHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <ServicesListing searchQuery={searchQuery} />
    </>
  )
}
