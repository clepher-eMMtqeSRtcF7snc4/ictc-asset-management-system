import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import type { SettingsAssetCategory } from "@repo/trpc/schemas";

export function AssetTypeFilters({
  search,
  setSearch,
  status,
  setStatus,
  categories,
  categoryId,
  setCategoryId,
}: {
  search: string;
  setSearch: (value: string) => void;
  status: "active" | "inactive" | "all";
  setStatus: (value: "active" | "inactive" | "all") => void;
  categories: SettingsAssetCategory[];
  categoryId: string;
  setCategoryId: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        className="max-w-sm"
        placeholder="Search asset types..."
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
      <Combobox
        options={[
          { id: "all", name: "All Categories" },
          ...categories.map((c) => ({ id: String(c.id), name: c.name })),
        ]}
        value={categoryId}
        onValueChange={setCategoryId}
        placeholder="Category"
        className="w-52"
        popperClassName="w-52"
      />
    </div>
  );
}
