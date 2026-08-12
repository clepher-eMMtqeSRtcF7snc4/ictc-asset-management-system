"use client";

import { QRCodeSVG } from "qrcode.react";

export function QrCodePreview({ value, size = 84 }: { value: string; size?: number }) {
  return <QRCodeSVG value={value} size={size} level="M" includeMargin />;
}
