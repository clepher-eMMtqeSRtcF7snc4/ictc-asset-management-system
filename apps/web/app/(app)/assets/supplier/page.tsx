"use client";

import { AssetTypeSection } from "@/components/assets/settings/type/asset-type-section";
import { CategorySection } from "@/components/assets/settings/categories/category-section";
import { ConditionsSection } from "@/components/assets/settings/conditions/conditions-section";
import { StatusesSection } from "@/components/assets/settings/statuses/status-section";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";


export default function SupplierPage() {
  
  const [activeTab, setActiveTab] = useState("assetType");

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <PageHeader
        title="Supplier"
        description="Manage supplier profiles, classifications, accreditation, and procurement information."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line">
          <TabsTrigger value="supplier">Supplier</TabsTrigger>
          <TabsTrigger value="status">Asset Status</TabsTrigger>
          <TabsTrigger value="condition">Asset Condition</TabsTrigger>
        </TabsList>
        <TabsContent value="assetType" className="mt-4 space-y-6">
          <AssetTypeSection/>
          <CategorySection />
        </TabsContent>
        <TabsContent value="status" className="mt-4 space-y-4">
          <StatusesSection />
        </TabsContent>
        <TabsContent value="condition" className="mt-4 space-y-4">
          <ConditionsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
