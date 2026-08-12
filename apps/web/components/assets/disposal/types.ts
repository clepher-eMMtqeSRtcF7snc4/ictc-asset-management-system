export type DisposalAsset = {
  id: string
  assetTag: string
  propertyNumber: string
  name: string
  category: string
  serialNumber: string
  brandModel: string
  condition: "Poor" | "Very Poor" | "Obsolete"
  status: "For Disposal"
  custodian: string
  department: string
  location: string
  acquiredDate: string
  acquisitionCost: string
  bookValue: string
}

export type DisposalDetails = {
  reason: string
  otherReason: string
  method: string
  otherMethod: string
  requestDate: string
  remarks: string
  accountabilityCleared: boolean
}

export type DisposalDocuments = {
  inspectionReport: boolean
  committeeResolution: boolean
  approvalDocument: boolean
  supportingDocuments: boolean
  approvalAcknowledged: boolean
}

export const disposalAssets: DisposalAsset[] = [
  {
    id: "dsp-1",
    assetTag: "MSU-ICT-2021-00045",
    propertyNumber: "PROP-2021-00045",
    name: "Dell OptiPlex 7070",
    category: "Desktop",
    serialNumber: "9J2X8H3",
    brandModel: "Dell / OptiPlex 7070",
    condition: "Poor",
    status: "For Disposal",
    custodian: "ICT Inventory Office",
    department: "ICT",
    location: "ICT Storage - Room 102",
    acquiredDate: "Mar 15, 2021",
    acquisitionCost: "₱56,450.00",
    bookValue: "₱4,250.00",
  },
  {
    id: "dsp-2",
    assetTag: "MSU-ICT-2019-00122",
    propertyNumber: "PROP-2019-00122",
    name: "HP LaserJet P2055",
    category: "Printer",
    serialNumber: "CNB7J1K2",
    brandModel: "HP / LaserJet P2055",
    condition: "Very Poor",
    status: "For Disposal",
    custodian: "Records Office",
    department: "Administration",
    location: "Records Room",
    acquiredDate: "Jul 08, 2019",
    acquisitionCost: "₱18,900.00",
    bookValue: "₱0.00",
  },
  {
    id: "dsp-3",
    assetTag: "MSU-ICT-2018-00087",
    propertyNumber: "PROP-2018-00087",
    name: "Cisco SG350 Switch",
    category: "Network Switch",
    serialNumber: "FOC1849V0Z",
    brandModel: "Cisco / SG350",
    condition: "Obsolete",
    status: "For Disposal",
    custodian: "Network Operations",
    department: "ICT",
    location: "Server Room",
    acquiredDate: "Jan 20, 2018",
    acquisitionCost: "₱24,600.00",
    bookValue: "₱0.00",
  },
  {
    id: "dsp-4",
    assetTag: "MSU-ICT-2020-00110",
    propertyNumber: "PROP-2020-00110",
    name: "APC Back-UPS 1500VA",
    category: "UPS",
    serialNumber: "AS18S0X9231",
    brandModel: "APC / Back-UPS 1500VA",
    condition: "Poor",
    status: "For Disposal",
    custodian: "Engineering Office",
    department: "Engineering",
    location: "Engineering Lab",
    acquiredDate: "Nov 17, 2020",
    acquisitionCost: "₱12,750.00",
    bookValue: "₱1,275.00",
  },
]

export const documentLabels = [
  ["inspectionReport", "Inspection report", "Physical condition and repairability assessment"],
  ["committeeResolution", "Committee review / resolution", "Disposal committee evaluation and recommendation"],
  ["approvalDocument", "Approval document", "Authorized approval to proceed with disposal"],
  ["supportingDocuments", "Other supporting documents", "Photos, quotations, clearances, or related records"],
] as const
