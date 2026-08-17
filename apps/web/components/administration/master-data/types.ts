// TODO: Replace these view-model interfaces with generated tRPC types
// when backend schemas for Room, Custodian, AssetStatus, and AssetCondition are added.

export interface Room {
  id: string;
  code: string;
  name: string;
  building: string;
  floor: string;
  department: string;
  roomType: string;
  custodian: string;
  status: "active" | "inactive";
}

export interface Custodian {
  id: string;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  position: string;
  department: string;
  office: string;
  status: "active" | "inactive";
  assignedAssets: number;
}

export interface AssetStatus {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  assetCount: number;
  status: "active" | "inactive";
}

export interface AssetCondition {
  id: string;
  code: string;
  name: string;
  description: string;
  severity: "Excellent" | "Good" | "Fair" | "Poor" | "Critical";
  assetCount: number;
  status: "active" | "inactive";
}
