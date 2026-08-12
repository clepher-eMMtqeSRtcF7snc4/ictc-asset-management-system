"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StickerPrintActions() {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => window.print()}
    >
      <Printer className="mr-2 size-4" />
      Print / Save PDF
    </Button>
  );
}
