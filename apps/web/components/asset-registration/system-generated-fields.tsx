export function SystemGeneratedFields({ assetTag, propertyNumber }: { assetTag: string; propertyNumber: string }) {
  return <div className="grid gap-2 text-sm"><span>Asset tag: <strong className="font-mono">{assetTag}</strong></span><span>Property number: <strong className="font-mono">{propertyNumber}</strong></span></div>;
}
