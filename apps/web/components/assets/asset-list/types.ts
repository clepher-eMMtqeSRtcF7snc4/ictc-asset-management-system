export type AssetStatus =
  | "AVAILABLE"
  | "ASSIGNED"
  | "UNDER_MAINTENANCE"
  | "FOR_TRANSFER"
  | "FOR_DISPOSAL"
  | "DISPOSED"

export type AssetCondition = "EXCELLENT" | "GOOD" | "FAIR" | "POOR"

export type AssetListItem = {
  id: string
  assetTag: string
  propertyNumber: string
  name: string
  category: string
  brandModel: string
  serialNumber: string
  custodian: string
  department: string
  location: string
  status: AssetStatus
  condition: AssetCondition
  acquisitionDate: string
}

type AssetFixture = [string, string, string, string, string, string, string, string, AssetStatus, AssetCondition, string]

const assetFixtures: AssetFixture[] = [
  ["000123", "Dell Latitude 5450", "Laptop", "Dell / Latitude 5450", "ABC123456", "Juan Dela Cruz", "ICT", "ICT Office - Room 203", "ASSIGNED", "GOOD", "Jan 15, 2024"],
  ["000456", "HP LaserJet Pro M404dn", "Printer", "HP / M404dn", "CNB4K3X2H2", "Maria Santos", "Engineering", "Engineering Office", "ASSIGNED", "GOOD", "Mar 10, 2023"],
  ["000789", "Cisco Catalyst 2960X", "Network Equipment", "Cisco / 2960X", "FDO2145X0Z3", "Pedro Cruz", "ICT", "Server Room", "ASSIGNED", "GOOD", "Feb 05, 2024"],
  ["000321", "Epson EB-X400", "Projector", "Epson / EB-X400", "X6GZ123456", "Ana Reyes", "Accounting", "AV Room", "ASSIGNED", "GOOD", "Dec 02, 2023"],
  ["000654", "APC Back-UPS 1500VA", "UPS", "APC / 1500VA", "AS1234567890", "Unassigned", "ICT", "ICT Storage", "AVAILABLE", "GOOD", "Jun 18, 2022"],
  ["000987", 'Samsung 24" Monitor', "Monitor", "Samsung / LF24T350", "S24M350123", "Unassigned", "ICT", "ICT Storage", "AVAILABLE", "GOOD", "Sep 14, 2021"],
  ["000111", "Storage NAS 4TB", "Storage", "Synology / DS418", "SN41812345", "Network Operations", "ICT", "Data Center", "UNDER_MAINTENANCE", "FAIR", "Jul 20, 2020"],
  ["000222", "Webcam Logitech C920", "Peripheral", "Logitech / C920", "C920A12345", "Unassigned", "Administration", "ICT Office - Room 205", "AVAILABLE", "GOOD", "Nov 11, 2019"],
  ["000333", "HP EliteDesk 800 G4", "Desktop", "HP / G4", "8CG8401234", "Unassigned", "ICT", "ICT Storage", "DISPOSED", "POOR", "Apr 09, 2018"],
  ["000444", "Wireless Router", "Network Equipment", "TP-Link / Archer C6", "TPLC612345", "Unassigned", "ICT", "Old Stock", "DISPOSED", "POOR", "Aug 30, 2017"],
  ["000555", "Lenovo ThinkPad E14", "Laptop", "Lenovo / ThinkPad E14", "PF3A9B27", "Carlo Bautista", "Supply", "Supply Office", "FOR_TRANSFER", "GOOD", "May 09, 2024"],
  ["000666", "Brother DCP-T720DW", "Printer", "Brother / DCP-T720DW", "E7J239148", "Unassigned", "Registrar", "Registrar Office", "FOR_DISPOSAL", "FAIR", "Jan 21, 2019"],
]

export const assetListItems: AssetListItem[] = assetFixtures.map(([suffix, name, category, brandModel, serialNumber, custodian, department, location, status, condition, acquisitionDate]) => ({
  id: `asset-${suffix}`,
  assetTag: `MSU-ICT-${suffix === "000123" || suffix === "000789" || suffix === "000321" || suffix === "000555" ? "2024" : suffix === "000456" ? "2023" : "2022"}-${suffix}`,
  propertyNumber: `PROP-${suffix === "000123" || suffix === "000789" || suffix === "000321" || suffix === "000555" ? "2024" : suffix === "000456" ? "2023" : "2022"}-${suffix}`,
  name,
  category,
  brandModel,
  serialNumber,
  custodian,
  department,
  location,
  status,
  condition,
  acquisitionDate,
}))
