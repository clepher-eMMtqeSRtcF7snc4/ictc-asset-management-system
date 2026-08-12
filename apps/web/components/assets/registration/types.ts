export type StaticCategory = {
  id: number;
  name: string;
  code: string;
  type: string;
  status: "active" | "inactive";
};

export type StaticDepartment = StaticCategory;
export type StaticLocation = StaticCategory;

export type StaticCustodian = {
  id: string;
  firstName: string;
  lastName: string;
};

export type StaticRegistrationIdentifiers = {
  assetTag: string;
  propertyNumber: string;
  qrValue: string;
};
