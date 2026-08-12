import { PackagePlus } from "lucide-react";

export function AssetRegistrationHeaderSection() {
  return (
    <header className="flex items-start gap-3">
      <div className="rounded-lg bg-primary/10 p-2.5 text-primary dark:bg-primary/20"><PackagePlus className="size-6" aria-hidden="true" /></div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Register asset</h1>
        <p className="text-sm text-muted-foreground">Create the authoritative asset record, identifier, and property sticker.</p>
      </div>
    </header>
  );
}
