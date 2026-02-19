"use client";

import { useState, Suspense } from "react";
import ProductsHero from "../../components/ProductsHero";
import ProductsListing from "../../components/ProductsListing";
import Spinner from "../../components/Spinner";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <ProductsHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Suspense fallback={<div className="flex justify-center py-12"><Spinner size="lg" /></div>}>
        <ProductsListing searchQuery={searchQuery} />
      </Suspense>
    </div>
  );
}
