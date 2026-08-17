"use client";

import type { Room } from "./types";
import type { Custodian } from "./types";
import type { AssetStatus } from "./types";
import type { AssetCondition } from "./types";
import type { Department } from "@repo/trpc/schemas";
import type { Category } from "@repo/trpc/schemas";

export const mockRooms: Room[] = [
  { id: "1", code: "ROOM-001", name: "ICT Office", building: "Administration Building", floor: "2nd Floor", department: "ICT", roomType: "Office", custodian: "Juan Dela Cruz", status: "active" },
  { id: "2", code: "ROOM-002", name: "Server Room", building: "Administration Building", floor: "2nd Floor", department: "ICT", roomType: "Server Room", custodian: "Juan Dela Cruz", status: "active" },
  { id: "3", code: "ROOM-003", name: "Supply Office", building: "Administration Building", floor: "1st Floor", department: "Supply", roomType: "Office", custodian: "Maria Santos", status: "active" },
  { id: "4", code: "ROOM-004", name: "Computer Laboratory 1", building: "Academic Building", floor: "3rd Floor", department: "ICT", roomType: "Laboratory", custodian: "Pedro Cruz", status: "active" },
  { id: "5", code: "ROOM-005", name: "Conference Room", building: "Administration Building", floor: "1st Floor", department: "ICT", roomType: "Meeting Room", custodian: "", status: "inactive" },
];

export const mockDepartments: Department[] = [
  { id: 1, code: "ICT", name: "Information and Communication Technology", shortName: "ICT", description: "Manages ICT infrastructure and services", parentDepartmentId: null, headUserId: "1", type: "Administrative", status: "active", createdAt: new Date(), updatedAt: new Date() },
  { id: 2, code: "SUP", name: "Supply Office", shortName: "Supply", description: "Manages supplies and inventory", parentDepartmentId: null, headUserId: "2", type: "Support Office", status: "active", createdAt: new Date(), updatedAt: new Date() },
  { id: 3, code: "ACC", name: "Accounting Office", shortName: "Accounting", description: "Handles financial and accounting matters", parentDepartmentId: null, headUserId: "3", type: "Administrative", status: "active", createdAt: new Date(), updatedAt: new Date() },
  { id: 4, code: "HR", name: "Human Resources", shortName: "HR", description: "Manages personnel and recruitment", parentDepartmentId: null, headUserId: "4", type: "Support Office", status: "inactive", createdAt: new Date(), updatedAt: new Date() },
];

export const mockCustodians: Custodian[] = [
  { id: "1", employeeId: "EMP-001", firstName: "Juan", middleName: "S.", lastName: "Dela Cruz", position: "ICT Staff", department: "ICT", office: "ICT Office", status: "active", assignedAssets: 15 },
  { id: "2", employeeId: "EMP-002", firstName: "Maria", middleName: "L.", lastName: "Santos", position: "Property Custodian", department: "Supply", office: "Supply Office", status: "active", assignedAssets: 8 },
  { id: "3", employeeId: "EMP-003", firstName: "Pedro", lastName: "Cruz", position: "Inventory Staff", department: "ICT", office: "ICT Office", status: "active", assignedAssets: 3 },
  { id: "4", employeeId: "EMP-004", firstName: "Ana", middleName: "R.", lastName: "Reyes", position: "Accounting Staff", department: "Accounting", office: "Accounting Office", status: "inactive", assignedAssets: 0 },
];

export const mockCategories: Category[] = [
  { id: 1, code: "ICT-LAPTOP", name: "Laptop", type: "Asset", description: "Portable computer devices", parentCategoryId: null, depreciable: true, defaultUsefulLife: 3, status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 2, code: "ICT-DESKTOP", name: "Desktop", type: "Asset", description: "Stationary computer systems", parentCategoryId: null, depreciable: true, defaultUsefulLife: 5, status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 3, code: "ICT-MONITOR", name: "Monitor", type: "Equipment", description: "Display screens and monitors", parentCategoryId: null, depreciable: true, defaultUsefulLife: 5, status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 4, code: "ICT-PRINTER", name: "Printer", type: "Equipment", description: "Printing devices", parentCategoryId: null, depreciable: true, defaultUsefulLife: 5, status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 5, code: "ICT-SERVER", name: "Server", type: "Asset", description: "Server hardware and rack units", parentCategoryId: null, depreciable: true, defaultUsefulLife: 5, status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 6, code: "NET-SWITCH", name: "Network Switch", type: "Equipment", description: "Network switching equipment", parentCategoryId: null, depreciable: true, defaultUsefulLife: 5, status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
];

export const mockStatuses: AssetStatus[] = [
  { id: "1", code: "AVAILABLE", name: "Available", description: "Ready for assignment", color: "success", assetCount: 256, status: "active" },
  { id: "2", code: "ASSIGNED", name: "Assigned", description: "Currently assigned to a user", color: "info", assetCount: 1892, status: "active" },
  { id: "3", code: "UNDER_MAINTENANCE", name: "Under Maintenance", description: "Asset is under repair", color: "warning", assetCount: 17, status: "active" },
  { id: "4", code: "FOR_DISPOSAL", name: "For Disposal", description: "Pending disposal", color: "warning", assetCount: 8, status: "active" },
  { id: "5", code: "DISPOSED", name: "Disposed", description: "No longer active", color: "secondary", assetCount: 125, status: "active" },
  { id: "6", code: "LOST", name: "Lost", description: "Asset is missing", color: "destructive", assetCount: 3, status: "inactive" },
];

export const mockConditions: AssetCondition[] = [
  { id: "1", code: "NEW", name: "New", description: "Brand new / unused", severity: "Excellent", assetCount: 45, status: "active" },
  { id: "2", code: "EXCELLENT", name: "Excellent", description: "Fully functional with no wear", severity: "Excellent", assetCount: 120, status: "active" },
  { id: "3", code: "GOOD", name: "Good", description: "Fully functional with minor wear", severity: "Good", assetCount: 1250, status: "active" },
  { id: "4", code: "FAIR", name: "Fair", description: "Minor wear but functional", severity: "Fair", assetCount: 340, status: "active" },
  { id: "5", code: "POOR", name: "Poor", description: "Significant wear but usable", severity: "Poor", assetCount: 28, status: "active" },
  { id: "6", code: "DAMAGED", name: "Damaged", description: "Requires repair", severity: "Critical", assetCount: 24, status: "active" },
  { id: "7", code: "UNSERVICEABLE", name: "Unserviceable", description: "Cannot be used", severity: "Critical", assetCount: 8, status: "inactive" },
];
