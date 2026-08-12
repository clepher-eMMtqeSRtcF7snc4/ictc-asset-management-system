export type TransferAsset = {
  id: string; assetTag: string; propertyNumber: string; name: string; custodian: string; department: string; office: string; location: string; condition: string; category: string; serialNumber: string; brandModel: string;
};
export type NewAssignment = { custodian: string; department: string; office: string; location: string; transferDate: string; reason: string; remarks: string };
export const transferAssets: TransferAsset[] = [
  { id: "t1", assetTag: "MSU-ICT-2024-000123", propertyNumber: "PROP-2024-000123", name: "Dell Latitude 5450", custodian: "Juan Dela Cruz", department: "ICT", office: "ICT Operations", location: "ICT Office - Room 203", condition: "Good", category: "Laptop", serialNumber: "ABC123456", brandModel: "Dell / Latitude 5450" },
  { id: "t2", assetTag: "MSU-ICT-2024-000456", propertyNumber: "PROP-2024-000456", name: "HP LaserJet Pro M404dn", custodian: "Maria Santos", department: "Engineering", office: "Engineering Office", location: "Engineering Office", condition: "Good", category: "Printer", serialNumber: "VNC1239ZK", brandModel: "HP / LaserJet Pro M404dn" },
  { id: "t3", assetTag: "MSU-ICT-2024-000789", propertyNumber: "PROP-2024-000789", name: "Cisco Catalyst 2960X", custodian: "Pedro Cruz", department: "ICT", office: "Network Operations", location: "Server Room", condition: "Good", category: "Network Switch", serialNumber: "FOC23459Z", brandModel: "Cisco / Catalyst 2960X" },
  { id: "t4", assetTag: "MSU-ICT-2024-000321", propertyNumber: "PROP-2024-000321", name: "Epson EB-X400", custodian: "Ana Reyes", department: "Accounting", office: "Accounting Office", location: "AV Room", condition: "Good", category: "Projector", serialNumber: "Q7F312456", brandModel: "Epson / EB-X400" },
];
export const transferTerms = ["I confirm that the asset is transferred in its recorded condition.", "I acknowledge responsibility for the transferred asset and agree to follow university property policies.", "I agree to properly use, protect, and maintain the transferred asset.", "I agree to return the asset when requested or when an authorized transfer is required."];
