import {
  Boxes,
  CircleGauge,
  HardDrive,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AssetStatus } from "./types";

const cards: {
  label: string;
  value: string;
  description: string;
  status?: AssetStatus;
  icon: typeof Boxes;
}[] = [
  {
    label: "Total Assets",
    value: "12,548",
    description: "All registered assets",
    icon: Boxes,
  },
  {
    label: "In Use",
    value: "9,820",
    description: "Currently assigned",
    status: "ASSIGNED",
    icon: ShieldCheck,
  },
  {
    label: "Available",
    value: "1,245",
    description: "Ready for assignment",
    status: "AVAILABLE",
    icon: CircleGauge,
  },
  {
    label: "Under Maintenance",
    value: "183",
    description: "In maintenance",
    status: "UNDER_MAINTENANCE",
    icon: Wrench,
  },
  {
    label: "Disposed",
    value: "72",
    description: "Disposed assets",
    status: "DISPOSED",
    icon: HardDrive,
  },
];

export function AssetSummaryCards({
  onFilter,
}: {
  onFilter: (status?: AssetStatus) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(({ label, value, description, status, icon: Icon }) => (
        <button
          key={label}
          onClick={() => onFilter(status)}
          className="text-left"
        >
          <Card className="h-full transition-colors hover:bg-muted/40">
            <CardContent className="p-4">
              <Icon className="mb-3 size-5 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">
                {label}
              </p>
              <p className="mt-1 text-2xl font-bold">{value}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {description}
              </p>
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}
