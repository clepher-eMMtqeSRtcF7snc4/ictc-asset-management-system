"use client";

import Image from "next/image";
import { QrCodePreview } from "./qr-code-preview";

export function AssetStickerPreview({
  assetTag,
  propertyNumber,
  name,
  qrValue,
  modelNumber = "—",
  serialNumber = "—",
  acquisitionDateCost = "—",
  referencePo = "—",
  personAccountable = "—",
}: {
  assetTag: string;
  propertyNumber: string;
  name: string;
  qrValue: string;
  modelNumber?: string;
  serialNumber?: string;
  acquisitionDateCost?: string;
  referencePo?: string;
  personAccountable?: string;
}) {
  return (
    <section
      id="asset-sticker"
      className="w-full rounded-lg border-2 border-slate-700 bg-white p-3 pb-1 text-black shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-[50px_minmax(0,1fr)] gap-2">
            <div className="flex items-center justify-center">
              <Image
                src="/img/msun-logo.png"
                alt="MSUN Logo"
                width={50}
                height={50}
                className="rounded-full p-1"
              />
            </div>
            <div className="flex flex-col items-center text-center">
              <p className="text-[7px] font-bold uppercase tracking-wide">
                Republic of the Philippines
              </p>
              <p className="text-[8px] font-bold uppercase">
                Mindanao State University at Naawan
              </p>
              <p className="text-[7px] font-bold uppercase">
                9023, Naawan, Misamis Oriental
              </p>
              <p className="mt-2 py-1 text-center text-[11px] font-bold">
                PROPERTY INVENTORY STICKER
              </p>
            </div>
          </div>

          <dl className="mt-3 space-y-1 text-[9px]">
            <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
              <dt className="font-medium">Property Number</dt>
              <dd className="border-b border-black font-bold">{assetTag}</dd>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
              <dt className="font-medium">Property Description</dt>
              <dd className="border-b border-black font-bold uppercase">
                {name || "Asset name"}
              </dd>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
              <dt className="font-medium">Model Number</dt>
              <dd className="border-b border-black font-bold">{modelNumber}</dd>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
              <dt className="font-medium">Serial Number</dt>
              <dd className="border-b border-black font-bold">{serialNumber}</dd>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
              <dt className="font-medium">Acquisition Date/Cost</dt>
              <dd className="border-b border-black font-bold">{acquisitionDateCost}</dd>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
              <dt className="font-medium">Reference (PO No.)</dt>
              <dd className="border-b border-black font-bold">{referencePo}</dd>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
              <dt className="font-medium">Person Accountable</dt>
              <dd className="border-b border-black font-bold uppercase">
                {personAccountable || "—"}
              </dd>
            </div>
          </dl>

          <div className="mt-3 text-[9px] font-medium">
            <div className="flex items-center gap-2">
              <span>Signature of Inventory Committee:</span>
            </div>
          </div>
        </div>

        <div className="-mt-2 -mr-3 shrink-0 text-center">
          <QrCodePreview value={qrValue} size={78} />
          <p className="text-[7px] font-bold">
            SCAN TO VIEW
            <br />
            ASSET DETAILS
          </p>
        </div>
      </div>

      <p className="mt-3 border-t border-black pt-1 text-center text-[8px] font-bold text-red-700">
        NOTE: DO NOT REMOVE THIS STICKER
      </p>
      <p className="pt-1 text-center text-[8px] font-bold">
        Unauthorized removal or tampering will be subject to disciplinary action
      </p>
    </section>
  );
}
