export type AssignableAsset = {
  id: string;
  assetTag: string;
  propertyNumber: string;
  name: string;
  category: string;
  serialNumber: string;
  location: string;
  condition: string;
  brandModel: string;
};

export type Assignee = {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  department: string;
  office: string;
  email: string;
};

export const assets: AssignableAsset[] = [
  { id: "a1", assetTag: "MSU-ICT-2024-000123", propertyNumber: "PROP-2024-000123", name: "Dell Latitude 5450", category: "Laptop", serialNumber: "ABC123456", location: "ICT Office - Room 203", condition: "Good", brandModel: "Dell / Latitude 5450" },
  { id: "a2", assetTag: "MSU-ICT-2024-000135", propertyNumber: "PROP-2024-000135", name: "Dell P2422H Monitor", category: "Peripheral", serialNumber: "CHK9283KX", location: "Supply Office", condition: "Good", brandModel: "Dell / P2422H" },
  { id: "a3", assetTag: "MSU-ICT-2024-000199", propertyNumber: "PROP-2024-000199", name: "Cisco Catalyst 2960X", category: "Network Switch", serialNumber: "FOC2345A92", location: "Server Room", condition: "Good", brandModel: "Cisco / Catalyst 2960X" },
  { id: "a4", assetTag: "MSU-ICT-2024-000221", propertyNumber: "PROP-2024-000221", name: "Epson EB-X06 Projector", category: "Projector", serialNumber: "Q7F312456", location: "Audio Visual Room", condition: "Good", brandModel: "Epson / EB-X06" },
];

export const assignees: Assignee[] = [
  { id: "u1", name: "Juan Dela Cruz", employeeId: "EMP-00123", position: "IT Specialist", department: "ICT", office: "ICT Operations", email: "juan.delacruz@msunaawan.edu.ph" },
  { id: "u2", name: "Maria Santos", employeeId: "EMP-00141", position: "Administrative Officer", department: "General Services", office: "Property Unit", email: "maria.santos@msunaawan.edu.ph" },
];

export const assignmentTerms = [
  "I confirm that the asset was received in good condition.",
  "I acknowledge responsibility for the assigned asset and agree to follow the university's property and ICT asset policies.",
  "I agree to properly use, protect, and maintain the assigned asset.",
  "I agree to return the asset when requested, upon transfer, separation, replacement, or other authorized circumstances.",
];
