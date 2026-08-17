export type InventoryItemStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK"
export type ReceivingStatus = "DRAFT" | "RECEIVED" | "INSPECTED" | "APPROVED" | "REJECTED"
export type IssuanceStatus = "DRAFT" | "ISSUED" | "APPROVED" | "CANCELLED"
export type AdjustmentType = "INCREASE" | "DECREASE"
export type AdjustmentStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED"
export type StockCountStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "ADJUSTED"
export type ReorderPriority = "HIGH" | "MEDIUM" | "LOW"

export type InventoryItem = {
  id: string
  sku: string
  name: string
  description: string
  category: string
  unit: string
  unitCost: number
  quantity: number
  minStock: number
  location: string
  supplier: string
  status: InventoryItemStatus
  lastUpdated: string
  lastReceived: string
}

export type ReceivingRecord = {
  id: string
  referenceNo: string
  supplier: string
  receivedDate: string
  totalItems: number
  totalCost: number
  status: ReceivingStatus
  receivedBy: string
  notes: string
}

export type ReceivingLineItem = {
  id: string
  itemId: string
  sku: string
  itemName: string
  quantity: number
  unitCost: number
  totalCost: number
}

export type IssuanceRecord = {
  id: string
  referenceNo: string
  requester: string
  department: string
  purpose: string
  issuedDate: string
  totalItems: number
  status: IssuanceStatus
  issuedBy: string
  notes: string
}

export type IssuanceLineItem = {
  id: string
  itemId: string
  sku: string
  itemName: string
  quantity: number
  currentStock: number
}

export type AdjustmentRecord = {
  id: string
  referenceNo: string
  adjustmentDate: string
  type: AdjustmentType
  reason: string
  reference: string
  adjustedBy: string
  status: AdjustmentStatus
  totalItems: number
}

export type AdjustmentLineItem = {
  id: string
  itemId: string
  sku: string
  itemName: string
  previousQty: number
  adjustedQty: number
  difference: number
}

export type StockCountRecord = {
  id: string
  referenceNo: string
  countDate: string
  location: string
  countedBy: string
  totalItems: number
  variances: number
  status: StockCountStatus
}

export type StockCountLineItem = {
  id: string
  itemId: string
  sku: string
  itemName: string
  systemQty: number
  countedQty: number
  variance: number
}

export type ReorderItem = {
  id: string
  itemId: string
  sku: string
  name: string
  category: string
  currentStock: number
  minStock: number
  reorderQty: number
  supplier: string
  unitCost: number
  estimatedTotal: number
  priority: ReorderPriority
}

// --- Mock Data ---

type InventoryItemFixture = [
  string, string, string, string, string, number, number, number, string, string, InventoryItemStatus, string, string,
]

const inventoryItemFixtures: InventoryItemFixture[] = [
  ["SKU-CBL-HDMI-002", "HDMI Cable, 2m", "High-speed HDMI cable with gold-plated connectors", "Cables", "pcs", 350, 46, 20, "ICT Stockroom A", "TechSource Philippines", "IN_STOCK", "Aug 10, 2026", "Aug 10, 2026"],
  ["SKU-ADP-USBC-001", "USB-C Adapter (Hub)", "7-in-1 USB-C hub with HDMI, USB 3.0, SD card", "Adapters", "pcs", 850, 8, 15, "ICT Stockroom A", "Datablitz Inc.", "LOW_STOCK", "Aug 08, 2026", "Jul 25, 2026"],
  ["SKU-TON-BK-205", "HP 205A Black Toner", "LaserJet toner cartridge, black, 1500 pages yield", "Toner", "pcs", 3200, 0, 5, "ICT Stockroom B", "HP Authorized Reseller", "OUT_OF_STOCK", "Aug 05, 2026", "Jun 15, 2026"],
  ["SKU-MOU-LOG-M331", "Logitech M331 Silent Mouse", "Wireless optical mouse with silent clicks", "Peripherals", "pcs", 450, 32, 10, "ICT Stockroom A", "Datablitz Inc.", "IN_STOCK", "Aug 12, 2026", "Aug 12, 2026"],
  ["SKU-KEY-LOG-K380", "Logitech K380 Multi-Device", "Bluetooth wireless keyboard, multi-device", "Peripherals", "pcs", 1295, 5, 10, "ICT Stockroom A", "Datablitz Inc.", "LOW_STOCK", "Aug 09, 2026", "Jul 20, 2026"],
  ["SKU-CBL-LAN-CAT6", "Cat6 Ethernet Cable, 3m", "RJ45 UTP Cat6 network cable, 3 meters", "Cables", "pcs", 85, 120, 50, "ICT Stockroom B", "TechSource Philippines", "IN_STOCK", "Aug 11, 2026", "Aug 11, 2026"],
  ["SKU-TON-CL-131A", "HP 131A Cyan Toner", "LaserJet Color MFP toner, cyan", "Toner", "pcs", 4500, 3, 5, "ICT Stockroom B", "HP Authorized Reseller", "LOW_STOCK", "Aug 06, 2026", "Jun 20, 2026"],
  ["SKU-DRV-SSD-256", "256GB SSD SATA III", "2.5-inch SATA solid-state drive", "Storage", "pcs", 1850, 15, 10, "ICT Stockroom A", "CD-R King", "IN_STOCK", "Aug 07, 2026", "Jul 30, 2026"],
  ["SKU-TPE-TF-8GB", "Kingston 8GB microSD", "MicroSDHC memory card with adapter", "Storage Media", "pcs", 280, 4, 10, "ICT Stockroom A", "CD-R King", "LOW_STOCK", "Aug 04, 2026", "Jun 10, 2026"],
  ["SKU-CBL-PWR-I3C", "IEC C13 Power Cable, 1.8m", "Standard computer power cable", "Cables", "pcs", 120, 88, 30, "ICT Stockroom B", "TechSource Philippines", "IN_STOCK", "Aug 13, 2026", "Aug 13, 2026"],
  ["SKU-FAN-CPU-120", "120mm CPU Cooling Fan", "Case fan with LED, 120mm", "Components", "pcs", 320, 0, 10, "ICT Stockroom B", "CD-R King", "OUT_OF_STOCK", "Jul 28, 2026", "May 05, 2026"],
  ["SKU-PAP-A4-RM80", "A4 Short Bond Paper (Ream)", "80gsm ream, 500 sheets", "Supplies", "ream", 320, 25, 20, "Supply Room", "National Bookstore", "IN_STOCK", "Aug 14, 2026", "Aug 14, 2026"],
  ["SKU-INK-EPA-003", "Epson 003 Black Ink", "Dye-based ink bottle, 65ml", "Ink", "bottle", 650, 2, 8, "ICT Stockroom A", "Epson Philippines", "LOW_STOCK", "Aug 03, 2026", "Jun 01, 2026"],
  ["SKU-THR-USB-C20", "USB-C to USB-A Cable, 1m", "USB 3.1 Type-C to Type-A cable", "Cables", "pcs", 150, 60, 25, "ICT Stockroom A", "TechSource Philippines", "IN_STOCK", "Aug 11, 2026", "Aug 01, 2026"],
  ["SKU-STS-WHT-4PK", "Whiteboard Markers (4-pack)", "Chisel tip, assorted colors", "Supplies", "pack", 180, 0, 15, "Supply Room", "National Bookstore", "OUT_OF_STOCK", "Jul 20, 2026", "Apr 18, 2026"],
]

export const inventoryItems: InventoryItem[] = inventoryItemFixtures.map(
  ([sku, name, description, category, unit, unitCost, quantity, minStock, location, supplier, status, lastUpdated, lastReceived]) => ({
    id: `item-${sku}`,
    sku,
    name,
    description,
    category,
    unit,
    unitCost,
    quantity,
    minStock,
    location,
    supplier,
    status,
    lastUpdated,
    lastReceived,
  }),
)

type ReceivingFixture = [string, string, string, string, number, number, ReceivingStatus, string]

const receivingFixtures: ReceivingFixture[] = [
  ["RCV-2026-0001", "TechSource Philippines", "Aug 10, 2026", "Juan Dela Cruz", 3, 1575, "APPROVED", "Regular replenishment"],
  ["RCV-2026-0002", "Datablitz Inc.", "Aug 12, 2026", "Maria Santos", 5, 4850, "APPROVED", "New stock for peripherals"],
  ["RCV-2026-0003", "HP Authorized Reseller", "Aug 08, 2026", "Juan Dela Cruz", 2, 7700, "INSPECTED", "Toner replenishment"],
  ["RCV-2026-0004", "CD-R King", "Aug 07, 2026", "Pedro Cruz", 4, 5580, "APPROVED", "SSD and memory cards"],
  ["RCV-2026-0005", "TechSource Philippines", "Aug 11, 2026", "Maria Santos", 6, 1380, "RECEIVED", "Network cables and power cables"],
  ["RCV-2026-0006", "National Bookstore", "Aug 14, 2026", "Ana Reyes", 2, 640, "RECEIVED", "Office supplies restock"],
  ["RCV-2026-0007", "Epson Philippines", "Aug 03, 2026", "Juan Dela Cruz", 1, 650, "APPROVED", "Ink replacement"],
  ["RCV-2026-0008", "TechSource Philippines", "Jul 28, 2026", "Pedro Cruz", 2, 320, "DRAFT", "Pending inspection"],
]

export const receivingRecords: ReceivingRecord[] = receivingFixtures.map(
  ([referenceNo, supplier, receivedDate, receivedBy, totalItems, totalCost, status, notes]) => ({
    id: `receiving-${referenceNo}`,
    referenceNo,
    supplier,
    receivedDate,
    totalItems,
    totalCost,
    status,
    receivedBy,
    notes,
  }),
)

type IssuanceFixture = [string, string, string, string, string, number, IssuanceStatus, string, string]

const issuanceFixtures: IssuanceFixture[] = [
  ["ISS-2026-0001", "Carlo Bautista", "College of Computing", "Lab setup for new classroom", "Aug 13, 2026", 15, "APPROVED", "Juan Dela Cruz", "LAN cables, mice, HDMI cables"],
  ["ISS-2026-0002", "Prof. Reyes", "Engineering", "Equipment for research lab", "Aug 12, 2026", 8, "APPROVED", "Maria Santos", "USB adapters, SSDs"],
  ["ISS-2026-0003", "Registrar Office", "Administration", "Printer supplies", "Aug 10, 2026", 5, "ISSUED", "Pedro Cruz", "Toner and paper"],
  ["ISS-2026-0004", "Supply Office", "Accounting", "General office supplies", "Aug 09, 2026", 10, "APPROVED", "Ana Reyes", "Markers, paper, cables"],
  ["ISS-2026-0005", "Network Operations", "ICT", "Server room consumables", "Aug 08, 2026", 3, "APPROVED", "Juan Dela Cruz", "Cooling fans, cables"],
  ["ISS-2026-0006", "Library", "Administration", "Student workstation setup", "Aug 07, 2026", 12, "DRAFT", "Maria Santos", "Keyboards, mice, cables"],
  ["ISS-2026-0007", "IT Support Desk", "ICT", "Replacement peripherals", "Aug 06, 2026", 4, "CANCELLED", "Pedro Cruz", "Cancelled - items unavailable"],
]

export const issuanceRecords: IssuanceRecord[] = issuanceFixtures.map(
  ([referenceNo, requester, department, purpose, issuedDate, totalItems, status, issuedBy, notes]) => ({
    id: `issuance-${referenceNo}`,
    referenceNo,
    requester,
    department,
    purpose,
    issuedDate,
    totalItems,
    status,
    issuedBy,
    notes,
  }),
)

type AdjustmentFixture = [string, string, AdjustmentType, string, string, string, AdjustmentStatus, number]

const adjustmentFixtures: AdjustmentFixture[] = [
  ["ADJ-2026-0001", "Aug 11, 2026", "DECREASE", "Damaged during storage inspection", "INSP-2026-003", "Juan Dela Cruz", "APPROVED", 2],
  ["ADJ-2026-0002", "Aug 09, 2026", "INCREASE", "Recovered from returned equipment", "RET-2026-0012", "Maria Santos", "APPROVED", 3],
  ["ADJ-2026-0003", "Aug 07, 2026", "DECREASE", "Expired consumables disposed", "DSP-2026-005", "Pedro Cruz", "APPROVED", 1],
  ["ADJ-2026-0004", "Aug 05, 2026", "INCREASE", "System correction from stock count", "SC-2026-0003", "Ana Reyes", "PENDING", 4],
  ["ADJ-2026-0005", "Aug 03, 2026", "DECREASE", "Lost items after campus event", "RPT-2026-002", "Juan Dela Cruz", "PENDING", 2],
  ["ADJ-2026-0006", "Aug 01, 2026", "INCREASE", "Donation from alumni association", "DON-2026-001", "Maria Santos", "DRAFT", 6],
]

export const adjustmentRecords: AdjustmentRecord[] = adjustmentFixtures.map(
  ([referenceNo, adjustmentDate, type, reason, reference, adjustedBy, status, totalItems]) => ({
    id: `adjustment-${referenceNo}`,
    referenceNo,
    adjustmentDate,
    type,
    reason,
    reference,
    adjustedBy,
    status,
    totalItems,
  }),
)

type StockCountFixture = [string, string, string, string, number, number, StockCountStatus]

const stockCountFixtures: StockCountFixture[] = [
  ["SC-2026-0001", "Aug 12, 2026", "ICT Stockroom A", "Juan Dela Cruz", 45, 3, "COMPLETED"],
  ["SC-2026-0002", "Aug 10, 2026", "ICT Stockroom B", "Maria Santos", 32, 1, "COMPLETED"],
  ["SC-2026-0003", "Aug 08, 2026", "Supply Room", "Pedro Cruz", 18, 2, "ADJUSTED"],
  ["SC-2026-0004", "Aug 06, 2026", "ICT Stockroom A", "Ana Reyes", 45, 0, "IN_PROGRESS"],
  ["SC-2026-0005", "Aug 04, 2026", "ICT Stockroom B", "Juan Dela Cruz", 32, 0, "DRAFT"],
]

export const stockCountRecords: StockCountRecord[] = stockCountFixtures.map(
  ([referenceNo, countDate, location, countedBy, totalItems, variances, status]) => ({
    id: `stockcount-${referenceNo}`,
    referenceNo,
    countDate,
    location,
    countedBy,
    totalItems,
    variances,
    status,
  }),
)

type ReceivingLineFixture = [string, string, number, number]

const receivingLineFixtures: Record<string, ReceivingLineFixture[]> = {
  "RCV-2026-0001": [
    ["SKU-CBL-HDMI-002", "HDMI Cable, 2m", 10, 350],
    ["SKU-CBL-LAN-CAT6", "Cat6 Ethernet Cable, 3m", 30, 85],
    ["SKU-CBL-PWR-I3C", "IEC C13 Power Cable, 1.8m", 25, 120],
  ],
  "RCV-2026-0002": [
    ["SKU-MOU-LOG-M331", "Logitech M331 Silent Mouse", 10, 450],
    ["SKU-KEY-LOG-K380", "Logitech K380 Multi-Device", 5, 1295],
    ["SKU-ADP-USBC-001", "USB-C Adapter (Hub)", 8, 850],
    ["SKU-THR-USB-C20", "USB-C to USB-A Cable, 1m", 20, 150],
    ["SKU-TPE-TF-8GB", "Kingston 8GB microSD", 5, 280],
  ],
  "RCV-2026-0003": [
    ["SKU-TON-BK-205", "HP 205A Black Toner", 2, 3200],
    ["SKU-TON-CL-131A", "HP 131A Cyan Toner", 1, 4500],
  ],
  "RCV-2026-0004": [
    ["SKU-DRV-SSD-256", "256GB SSD SATA III", 3, 1850],
    ["SKU-TPE-TF-8GB", "Kingston 8GB microSD", 4, 280],
    ["SKU-FAN-CPU-120", "120mm CPU Cooling Fan", 6, 320],
    ["SKU-STS-WHT-4PK", "Whiteboard Markers (4-pack)", 5, 180],
  ],
  "RCV-2026-0005": [
    ["SKU-CBL-LAN-CAT6", "Cat6 Ethernet Cable, 3m", 20, 85],
    ["SKU-CBL-PWR-I3C", "IEC C13 Power Cable, 1.8m", 10, 120],
    ["SKU-CBL-HDMI-002", "HDMI Cable, 2m", 5, 350],
    ["SKU-THR-USB-C20", "USB-C to USB-A Cable, 1m", 15, 150],
    ["SKU-MOU-LOG-M331", "Logitech M331 Silent Mouse", 4, 450],
    ["SKU-ADP-USBC-001", "USB-C Adapter (Hub)", 2, 850],
  ],
  "RCV-2026-0006": [
    ["SKU-PAP-A4-RM80", "A4 Short Bond Paper (Ream)", 2, 320],
    ["SKU-STS-WHT-4PK", "Whiteboard Markers (4-pack)", 0, 180],
  ],
  "RCV-2026-0007": [
    ["SKU-INK-EPA-003", "Epson 003 Black Ink", 1, 650],
  ],
  "RCV-2026-0008": [
    ["SKU-FAN-CPU-120", "120mm CPU Cooling Fan", 2, 320],
    ["SKU-TON-BK-205", "HP 205A Black Toner", 0, 3200],
  ],
}

export const receivingLineItems: Record<string, ReceivingLineItem[]> = Object.fromEntries(
  Object.entries(receivingLineFixtures).map(([referenceNo, lines]) => [
    referenceNo,
    lines.map(([sku, itemName, quantity, unitCost], index) => ({
      id: `${referenceNo}-line-${index + 1}`,
      itemId: `item-${sku}`,
      sku,
      itemName,
      quantity,
      unitCost,
      totalCost: quantity * unitCost,
    })),
  ]),
)

type IssuanceLineFixture = [string, string, number]

const issuanceLineFixtures: Record<string, IssuanceLineFixture[]> = {
  "ISS-2026-0001": [
    ["SKU-CBL-LAN-CAT6", "Cat6 Ethernet Cable, 3m", 10],
    ["SKU-MOU-LOG-M331", "Logitech M331 Silent Mouse", 3],
    ["SKU-CBL-HDMI-002", "HDMI Cable, 2m", 2],
  ],
  "ISS-2026-0002": [
    ["SKU-ADP-USBC-001", "USB-C Adapter (Hub)", 3],
    ["SKU-DRV-SSD-256", "256GB SSD SATA III", 5],
  ],
  "ISS-2026-0003": [
    ["SKU-TON-BK-205", "HP 205A Black Toner", 2],
    ["SKU-PAP-A4-RM80", "A4 Short Bond Paper (Ream)", 3],
  ],
  "ISS-2026-0004": [
    ["SKU-STS-WHT-4PK", "Whiteboard Markers (4-pack)", 4],
    ["SKU-PAP-A4-RM80", "A4 Short Bond Paper (Ream)", 3],
    ["SKU-CBL-PWR-I3C", "IEC C13 Power Cable, 1.8m", 3],
  ],
  "ISS-2026-0005": [
    ["SKU-FAN-CPU-120", "120mm CPU Cooling Fan", 2],
    ["SKU-CBL-PWR-I3C", "IEC C13 Power Cable, 1.8m", 1],
  ],
  "ISS-2026-0006": [
    ["SKU-KEY-LOG-K380", "Logitech K380 Multi-Device", 4],
    ["SKU-MOU-LOG-M331", "Logitech M331 Silent Mouse", 4],
    ["SKU-THR-USB-C20", "USB-C to USB-A Cable, 1m", 4],
  ],
  "ISS-2026-0007": [
    ["SKU-TON-CL-131A", "HP 131A Cyan Toner", 2],
    ["SKU-INK-EPA-003", "Epson 003 Black Ink", 2],
  ],
}

export const issuanceLineItems: Record<string, IssuanceLineItem[]> = Object.fromEntries(
  Object.entries(issuanceLineFixtures).map(([referenceNo, lines]) => [
    referenceNo,
    lines.map(([sku, itemName, quantity], index) => ({
      id: `${referenceNo}-line-${index + 1}`,
      itemId: `item-${sku}`,
      sku,
      itemName,
      quantity,
      currentStock: inventoryItems.find((item) => item.id === `item-${sku}`)?.quantity ?? 0,
    })),
  ]),
)

type AdjustmentLineFixture = [string, number, number]

const adjustmentLineFixtures: Record<string, AdjustmentLineFixture[]> = {
  "ADJ-2026-0001": [
    ["SKU-MOU-LOG-M331", 32, 30],
    ["SKU-CBL-LAN-CAT6", 120, 118],
  ],
  "ADJ-2026-0002": [
    ["SKU-ADP-USBC-001", 5, 8],
    ["SKU-THR-USB-C20", 55, 60],
    ["SKU-CBL-HDMI-002", 44, 46],
  ],
  "ADJ-2026-0003": [["SKU-INK-EPA-003", 3, 2]],
  "ADJ-2026-0004": [
    ["SKU-DRV-SSD-256", 12, 15],
    ["SKU-TPE-TF-8GB", 1, 4],
    ["SKU-FAN-CPU-120", 2, 0],
    ["SKU-KEY-LOG-K380", 3, 5],
  ],
  "ADJ-2026-0005": [
    ["SKU-CBL-HDMI-002", 48, 44],
    ["SKU-MOU-LOG-M331", 35, 32],
  ],
  "ADJ-2026-0006": [
    ["SKU-MOU-LOG-M331", 30, 35],
    ["SKU-KEY-LOG-K380", 3, 5],
    ["SKU-CBL-LAN-CAT6", 115, 120],
    ["SKU-CBL-PWR-I3C", 85, 88],
    ["SKU-CBL-HDMI-002", 42, 46],
    ["SKU-THR-USB-C20", 55, 60],
  ],
}

export const adjustmentLineItems: Record<string, AdjustmentLineItem[]> = Object.fromEntries(
  Object.entries(adjustmentLineFixtures).map(([referenceNo, lines]) => [
    referenceNo,
    lines.map(([sku, previousQty, adjustedQty], index) => ({
      id: `${referenceNo}-line-${index + 1}`,
      itemId: `item-${sku}`,
      sku,
      itemName: inventoryItems.find((item) => item.id === `item-${sku}`)?.name ?? sku,
      previousQty,
      adjustedQty,
      difference: adjustedQty - previousQty,
    })),
  ]),
)

type StockCountLineFixture = [string, number, number]

const stockCountLineFixtures: Record<string, StockCountLineFixture[]> = {
  "SC-2026-0001": [
    ["SKU-MOU-LOG-M331", 32, 31],
    ["SKU-CBL-HDMI-002", 46, 46],
    ["SKU-CBL-LAN-CAT6", 120, 119],
  ],
  "SC-2026-0002": [["SKU-TON-BK-205", 0, 1]],
  "SC-2026-0003": [
    ["SKU-STS-WHT-4PK", 0, 2],
    ["SKU-PAP-A4-RM80", 25, 23],
  ],
}

export const stockCountLineItems: Record<string, StockCountLineItem[]> = Object.fromEntries(
  Object.entries(stockCountLineFixtures).map(([referenceNo, lines]) => [
    referenceNo,
    lines.map(([sku, systemQty, countedQty], index) => ({
      id: `${referenceNo}-line-${index + 1}`,
      itemId: `item-${sku}`,
      sku,
      itemName: inventoryItems.find((item) => item.id === `item-${sku}`)?.name ?? sku,
      systemQty,
      countedQty,
      variance: countedQty - systemQty,
    })),
  ]),
)

export const reorderItems: ReorderItem[] = [
  { id: "ro-1", itemId: "item-SKU-TON-BK-205", sku: "SKU-TON-BK-205", name: "HP 205A Black Toner", category: "Toner", currentStock: 0, minStock: 5, reorderQty: 10, supplier: "HP Authorized Reseller", unitCost: 3200, estimatedTotal: 32000, priority: "HIGH" },
  { id: "ro-2", itemId: "item-SKU-FAN-CPU-120", sku: "SKU-FAN-CPU-120", name: "120mm CPU Cooling Fan", category: "Components", currentStock: 0, minStock: 10, reorderQty: 15, supplier: "CD-R King", unitCost: 320, estimatedTotal: 4800, priority: "HIGH" },
  { id: "ro-3", itemId: "item-SKU-STS-WHT-4PK", sku: "SKU-STS-WHT-4PK", name: "Whiteboard Markers (4-pack)", category: "Supplies", currentStock: 0, minStock: 15, reorderQty: 20, supplier: "National Bookstore", unitCost: 180, estimatedTotal: 3600, priority: "MEDIUM" },
  { id: "ro-4", itemId: "item-SKU-ADP-USBC-001", sku: "SKU-ADP-USBC-001", name: "USB-C Adapter (Hub)", category: "Adapters", currentStock: 8, minStock: 15, reorderQty: 10, supplier: "Datablitz Inc.", unitCost: 850, estimatedTotal: 8500, priority: "MEDIUM" },
  { id: "ro-5", itemId: "item-SKU-KEY-LOG-K380", sku: "SKU-KEY-LOG-K380", name: "Logitech K380 Multi-Device", category: "Peripherals", currentStock: 5, minStock: 10, reorderQty: 10, supplier: "Datablitz Inc.", unitCost: 1295, estimatedTotal: 12950, priority: "MEDIUM" },
  { id: "ro-6", itemId: "item-SKU-TON-CL-131A", sku: "SKU-TON-CL-131A", name: "HP 131A Cyan Toner", category: "Toner", currentStock: 3, minStock: 5, reorderQty: 8, supplier: "HP Authorized Reseller", unitCost: 4500, estimatedTotal: 36000, priority: "MEDIUM" },
  { id: "ro-7", itemId: "item-SKU-TPE-TF-8GB", sku: "SKU-TPE-TF-8GB", name: "Kingston 8GB microSD", category: "Storage Media", currentStock: 4, minStock: 10, reorderQty: 15, supplier: "CD-R King", unitCost: 280, estimatedTotal: 4200, priority: "LOW" },
  { id: "ro-8", itemId: "item-SKU-INK-EPA-003", sku: "SKU-INK-EPA-003", name: "Epson 003 Black Ink", category: "Ink", currentStock: 2, minStock: 8, reorderQty: 10, supplier: "Epson Philippines", unitCost: 650, estimatedTotal: 6500, priority: "LOW" },
]

// Helper: format currency
export function formatCurrency(value: number): string {
  return `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
}
