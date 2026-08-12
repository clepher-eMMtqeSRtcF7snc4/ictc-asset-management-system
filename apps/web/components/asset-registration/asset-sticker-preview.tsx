"use client";

import { QrCodePreview } from "./qr-code-preview";

export function AssetStickerPreview({ assetTag, propertyNumber, name, qrValue }: { assetTag: string; propertyNumber: string; name: string; qrValue: string }) {
  return <section id="asset-sticker" className="w-[336px] rounded border bg-white p-3 text-black shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide">MSU Naawan · Property Inventory</p>
        <p className="mt-2 truncate text-sm font-semibold">{name || "Asset name"}</p>
        <p className="mt-1 font-mono text-xs font-bold">{assetTag}</p>
        <p className="font-mono text-[10px]">{propertyNumber}</p>
      </div>
      <QrCodePreview value={qrValue} size={72} />
    </div>
    <p className="mt-2 text-[9px] text-slate-600">Scan for the official digital asset record and history.</p>
  </section>;
}
