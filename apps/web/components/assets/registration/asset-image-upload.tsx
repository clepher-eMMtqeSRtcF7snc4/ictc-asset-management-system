"use client";

import { ImagePlus, Replace, X } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function AssetImageUpload({ value, onChange }: { value?: string; onChange: (value: string | undefined) => void }) {
  const input = useRef<HTMLInputElement>(null);
  function preview(file: File) {
    onChange(URL.createObjectURL(file));
  }
  return <div>
    <div className="relative grid min-h-52 place-items-center overflow-hidden rounded-md border bg-muted/40">
      {value ? <img src={value} alt="Asset preview" className="h-52 w-full object-cover" /> : <div className="grid place-items-center gap-2 text-center text-muted-foreground"><ImagePlus className="size-8" /><span className="text-xs">No image selected</span></div>}
      {value && <Button type="button" variant="secondary" size="sm" className="absolute right-2 top-2" onClick={() => input.current?.click()}><Replace className="mr-1.5 size-3.5" />Replace</Button>}
      {value && <Button type="button" variant="secondary" size="icon-sm" className="absolute right-2 bottom-2" aria-label="Remove image" onClick={() => onChange(undefined)}><X className="size-4" /></Button>}
    </div>
    {!value && <Button type="button" variant="outline" className="mt-3 w-full" onClick={() => input.current?.click()}><ImagePlus className="mr-2 size-4" />Choose asset image</Button>}
    <p className="mt-2 text-xs text-muted-foreground">Preview only. Images are not uploaded while the demo is active.</p>
    <input ref={input} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) preview(file); }} />
  </div>;
}
