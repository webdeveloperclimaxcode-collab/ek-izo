"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import ProductVideos from "@/components/ProductVideos";
import RelatedDocuments from "@/components/RelatedDocuments";
import CalculateConsumption from "@/components/CalculateConsumption";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  return (
    <div>
      <ProductDetail productId={productId} />
      <ProductVideos productId={productId} />
      <RelatedDocuments productId={productId} />
      <CalculateConsumption />
    </div>
  );
}
