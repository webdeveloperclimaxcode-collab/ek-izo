"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ServiceDetail from "@/components/ServiceDetail";
import ServiceVideos from "@/components/ServiceVideos";
import ServiceDocuments from "@/components/ServiceDocuments";
import CalculateConsumption from "@/components/CalculateConsumption";

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;

  return (
    <div>
      <ServiceDetail serviceId={serviceId} />
      <ServiceVideos serviceId={serviceId} />
      <ServiceDocuments serviceId={serviceId} />
      <CalculateConsumption />
    </div>
  );
}
