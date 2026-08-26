import { CategorySection } from "@/components/assets/settings/categories/category-section";
import { ConditionsSection } from "@/components/assets/settings/conditions/conditions-section";
import { StatusesSection } from "@/components/assets/settings/statuses/statuses-section";
import { PageHeader } from "@/components/layout/page-header";


export default async function MasterDataPage() {

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <PageHeader
        title="Asset Settings"
        description="Manage standardized reference data used throughout the Asset & Inventory Management System."
      />

      <CategorySection />
      <StatusesSection />
      <ConditionsSection />
    </div>
  );
}
