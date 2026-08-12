"use client";

import Image from "next/image";
import { QrCodePreview } from "./qr-code-preview";

export function AssetStickerPreview({
  assetTag,
  propertyNumber,
  name,
  qrValue,
}: {
  assetTag: string;
  propertyNumber: string;
  name: string;
  qrValue: string;
}) {
  return (
    <section
      id="asset-sticker"
      className="w-full rounded-lg border-2 border-slate-700 bg-white p-3 pb-1 text-black shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="grid grid-cols-5 gap-1">
            <div className="">
              <Image 
                src="/img/msun-logo.png"
                alt="MSUN Logo"
                width={50}
                height={50}
              />
            </div>
            <div className="col-span-4">
              <div className="flex flex-col justify-center items-center">
                <p className="text-[7px] font-bold uppercase tracking-wide">
                  Republic of the Philippines
                </p>
                <p className="text-[8px] font-bold uppercase">
                  Mindanao State University at Naawan
                </p>
                <p className="text-[7px] font-bold uppercase">
                  9023, Naawan, Misamis Oriental
                </p>
                <p className="mt-2 border-y border-black py-1 text-center text-[11px] font-bold">
                  PROPERTY INVENTORY
                </p>
              </div>
            </div>
          </div>
          <dl className="mt-2 grid grid-cols-[100px_1fr] gap-y-0.5 text-[9px]">
            <dt>Property Number</dt>
            <dd className="font-bold">{assetTag}</dd>
            <dt>Property Description</dt>
            <dd className="truncate font-bold">{name || "Asset name"}</dd>
            <dt>Model Number</dt>
            <dd className="font-bold">{propertyNumber}</dd>
            <dt>Serial Number</dt>
            <dd className="font-bold">{propertyNumber}</dd>
            <dt>Acquisition Date/Cost</dt>
            <dd className="font-bold">{propertyNumber}</dd>
            <dt>Reference (PO No.)</dt>
            <dd className="font-bold">{propertyNumber}</dd>
            <dt>Person Accountable</dt>
            <dd className="truncate font-bold">{name || "Employee name"}</dd>
          </dl>
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
      <p className="mt-2 border-t border-black pt-1 text-center text-[8px] font-bold text-red-700">
        NOTE: DO NOT REMOVE THIS STICKER
      </p>
      <p className="text-center pt-1 font-bold text-[8px]">Unauthorized removal or tampering will be subject to disciplinary action</p>
    </section>
  );
}
