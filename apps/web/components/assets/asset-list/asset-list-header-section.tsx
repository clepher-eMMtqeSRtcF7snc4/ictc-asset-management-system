import { Download, MoreHorizontal, PackagePlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AssetListHeaderSection() {
  return (
    <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs text-muted-foreground">
          Dashboard <span className="mx-2">›</span> Asset Management{" "}
          <span className="mx-2">›</span> Asset Registry
        </p>
        <h1 className="mt-3 text-2xl font-bold">Asset Registry</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View, search, filter, and manage all registered ICT assets.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="outline">
          <Download /> Export
        </Button>
        <Button asChild>
          <Link href="/assets/registration">
            <PackagePlus /> Register Asset
          </Link>
        </Button>
      </div>
    </header>
  );
}
