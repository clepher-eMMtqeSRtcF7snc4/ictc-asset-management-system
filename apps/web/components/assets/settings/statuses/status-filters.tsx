import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StatusFilters({
  search,
  setSearch,
  status,
  setStatus,
}: {
  search: string;
  setSearch: (value: string) => void;
  status: "active" | "inactive" | "all";
  setStatus: (value: "active" | "inactive" | "all") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        className="max-w-sm"
        placeholder="Search asset statuses..."
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
      />
      <Select
        value={status}
        onValueChange={(value: string) => setStatus(value as "active" | "inactive" | "all")}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}