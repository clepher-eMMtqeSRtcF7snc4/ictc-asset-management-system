"use client";

import { SupplierSection } from "@/components/assets/supplier/section";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";


export default function SupplierPage() {
  
  const [activeTab, setActiveTab] = useState("supplier");

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <PageHeader
        title="Supplier"
        description="Manage supplier profiles, classifications, accreditation, and procurement information."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line">
          <TabsTrigger value="supplier">Supplier</TabsTrigger>
          <TabsTrigger value="status">Supplier Status</TabsTrigger>
          <TabsTrigger value="industry">Industry</TabsTrigger>
        </TabsList>
        <TabsContent value="supplier" className="mt-4 space-y-6">
          <SupplierSection/>
        </TabsContent>
        <TabsContent value="status" className="mt-4 space-y-4">
          
        </TabsContent>
        <TabsContent value="condition" className="mt-4 space-y-4">
          
        </TabsContent>
      </Tabs>
    </div>
  );
}
