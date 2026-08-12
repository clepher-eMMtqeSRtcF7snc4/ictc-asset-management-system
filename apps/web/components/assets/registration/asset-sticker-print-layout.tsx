export function AssetStickerPrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="print:fixed print:inset-0 print:grid print:place-items-center print:bg-white">
      {children}
    </div>
  );
}
