"use client"

import { AssetRegistrationContentSection } from "@/components/assets/registration/asset-registration-content-section";
import type {
  StaticCategory,
  StaticCustodian,
  StaticDepartment,
  StaticLocation,
  StaticRegistrationIdentifiers,
} from "@/components/assets/registration/types";
import { PageHeader } from "@/components/layout/page-header";

const categories: StaticCategory[] = [
  {
    id: 1,
    name: "ICT Equipment",
    code: "ICT",
    type: "Equipment",
    status: "active",
  },
  {
    id: 2,
    name: "Office Furniture",
    code: "FUR",
    type: "Furniture",
    status: "active",
  },
  {
    id: 3,
    name: "Laboratory Equipment",
    code: "LAB",
    type: "Equipment",
    status: "active",
  },
];

const departments: StaticDepartment[] = [
  {
    id: 1,
    name: "College of Information Technology",
    code: "CIT",
    type: "Academic",
    status: "active",
  },
  {
    id: 2,
    name: "Office of the Registrar",
    code: "REG",
    type: "Administrative",
    status: "active",
  },
  {
    id: 3,
    name: "General Services Office",
    code: "GSO",
    type: "Administrative",
    status: "active",
  },
];

const locations: StaticLocation[] = [
  {
    id: 1,
    name: "ICT Laboratory 1",
    code: "ICT-LAB-1",
    type: "Laboratory",
    status: "active",
  },
  {
    id: 2,
    name: "Administration Building",
    code: "ADMIN",
    type: "Office",
    status: "active",
  },
  {
    id: 3,
    name: "Central Stockroom",
    code: "STOCK",
    type: "Storage",
    status: "active",
  },
];

const custodians: StaticCustodian[] = [
  {
    id: "demo-user-1",
    firstName: "Maria",
    lastName: "Santos",
  },
  {
    id: "demo-user-2",
    firstName: "Juan",
    lastName: "Dela Cruz",
  },
];

export default function AssetRegistrationPage() {

  async function previewIdentifiers({ categoryId }: { categoryId: number }) {
      const category = categories.find((item) => item.id === categoryId);
      const code = category?.code ?? "AST";
      const sequence = "000247";
      const data: StaticRegistrationIdentifiers = {
        assetTag: `AST-${code}-2026-${sequence}`,
        propertyNumber: `MSUN-${code}-2026-${sequence}`,
        qrValue: `${window.location.origin}/assets/demo-${categoryId}-${sequence}`,
      };
      return { ok: true as const, data };
    }

    async function registerAsset() {
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      return { ok: true, id: 247 };
    }

  return (
    <div className="space-y-6">
        <PageHeader
          title="Asset Registration"
          description="Register a new ICT asset and generate a QR sticker for physical
              inventory."
          // action={
          //   <Button asChild>
          //     <Link href="/assets/registration">
          //       <PackagePlus /> Add asset
          //     </Link>
          //   </Button>
          // }
        />
        <AssetRegistrationContentSection
            categories={categories}
            departments={departments}
            locations={locations}
            custodians={custodians}
            onPreviewIdentifiers={previewIdentifiers}
            onRegister={registerAsset}
          />
    </div>
  )
  ;
}
