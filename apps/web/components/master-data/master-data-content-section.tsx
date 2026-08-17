"use client";

import { PageHeader } from "@/components/layout/page-header";
import { MasterDataTabs } from "./master-data-tabs";

export function MasterDataContentSection() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Data"
        description="Manage standardized reference data used throughout the Asset & Inventory Management System."
      />
      <MasterDataTabs />
    </div>
  );
}
