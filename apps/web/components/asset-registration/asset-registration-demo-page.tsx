"use client";

import type {
  Category,
  Department,
  Location,
  RegistrationIdentifiers,
  RegisterAssetInput,
  UserManagementUser,
} from "@repo/trpc/schemas";
import { AssetRegistrationContentSection } from "./asset-registration-content-section";

const categories: Category[] = [
  { id: 1, name: "ICT Equipment", code: "ICT", type: "Equipment", status: "active" },
  { id: 2, name: "Office Furniture", code: "FUR", type: "Furniture", status: "active" },
  { id: 3, name: "Laboratory Equipment", code: "LAB", type: "Equipment", status: "active" },
];

const departments: Department[] = [
  { id: 1, name: "College of Information Technology", code: "CIT", type: "Academic", status: "active" },
  { id: 2, name: "Office of the Registrar", code: "REG", type: "Administrative", status: "active" },
  { id: 3, name: "General Services Office", code: "GSO", type: "Administrative", status: "active" },
];

const locations: Location[] = [
  { id: 1, name: "ICT Laboratory 1", code: "ICT-LAB-1", type: "Laboratory", status: "active" },
  { id: 2, name: "Administration Building", code: "ADMIN", type: "Office", status: "active" },
  { id: 3, name: "Central Stockroom", code: "STOCK", type: "Storage", status: "active" },
];

const custodians: UserManagementUser[] = [
  { id: "demo-user-1", firstName: "Maria", middleName: null, lastName: "Santos", email: "maria.santos@example.edu", position: "IT Officer", designation: "Custodian", office: "College of Information Technology", departmentId: 1, departmentName: "College of Information Technology", roleId: "demo-role", roleName: "Asset Officer", status: "active", profilePicture: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "demo-user-2", firstName: "Juan", middleName: null, lastName: "Dela Cruz", email: "juan.delacruz@example.edu", position: "Administrative Officer", designation: "Property Custodian", office: "General Services Office", departmentId: 3, departmentName: "General Services Office", roleId: "demo-role", roleName: "Asset Officer", status: "active", profilePicture: null, createdAt: new Date(), updatedAt: new Date() },
];

export function AssetRegistrationDemoPage() {
  async function previewIdentifiers({ categoryId }: { categoryId: number }) {
    const category = categories.find((item) => item.id === categoryId);
    const code = category?.code ?? "AST";
    const sequence = "000247";
    const data: RegistrationIdentifiers = {
      assetTag: `AST-${code}-2026-${sequence}`,
      propertyNumber: `MSUN-${code}-2026-${sequence}`,
      qrValue: `${window.location.origin}/assets/demo-${categoryId}-${sequence}`,
    };
    return { ok: true as const, data };
  }
  async function registerAsset(_input: RegisterAssetInput) {
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    return { ok: true, id: 247 };
  }
  return <AssetRegistrationContentSection categories={categories} departments={departments} locations={locations} custodians={custodians} onPreviewIdentifiers={previewIdentifiers} onRegister={registerAsset} />;
}
