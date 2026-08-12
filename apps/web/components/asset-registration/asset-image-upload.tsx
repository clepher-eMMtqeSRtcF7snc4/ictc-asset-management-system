"use client";

import { ImagePlus, X } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function AssetImageUpload({ value, onChange }: { value?: string; onChange: (value: string | undefined) => void }) {
  const input = useRef<HTMLInputElement>(null);
  function preview(file: File) {
    onChange(URL.createObjectURL(file));
  }
  return <div className="rounded-lg border border-dashed p-4">
    {value ? <div className="flex items-center gap-3"><img src={value} alt="Asset preview" className="size-16 rounded object-cover" /><Button type="button" variant="ghost" size="icon" onClick={() => onChange(undefined)}><X className="size-4" /></Button></div> :
      <Button type="button" variant="outline" onClick={() => input.current?.click()}><ImagePlus className="mr-2 size-4" />Choose asset image</Button>}
    <p className="mt-2 text-xs text-muted-foreground">Preview only. Images are not uploaded while the demo is active.</p>
    <input ref={input} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) preview(file); }} />
  </div>;
}
