"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationsTab } from "./locations/locations-tab";
import { CategoriesTab } from "./categories/categories-tab";

export function MasterDataTabs() {
  return (
    <Tabs defaultValue="locations" className="space-y-6">
      <TabsList>
        <TabsTrigger value="locations">Locations</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>
      <TabsContent value="locations" className="space-y-6">
        <LocationsTab />
      </TabsContent>
      <TabsContent value="categories" className="space-y-6">
        <CategoriesTab />
      </TabsContent>
    </Tabs>
  );
}
