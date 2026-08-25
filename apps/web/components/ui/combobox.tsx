"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface ComboboxProps {
  options: { id: string; name: string; photoUrl?: string | null }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  className?: string;
  fullWidth?: boolean;
  renderOption?: (option: { id: string; name: string; photoUrl?: string | null }) => React.ReactNode;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder,
  className,
  fullWidth = false,
  renderOption,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter((option) =>
      option.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between",
            fullWidth ? "w-full" : "w-40",
            className
          )}
        >
          {selectedOption ? selectedOption.name : placeholder}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0", fullWidth ? "" : "w-40")}
        align="start"
        sideOffset={4}
        style={fullWidth && triggerRef.current ? { width: `${triggerRef.current.offsetWidth}px` } : undefined}
      >
        <div className="p-2 border-b">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          <div
            className={cn(
              "px-2.5 py-1.5 text-xs font-medium text-muted-foreground",
              !value && "font-semibold text-foreground"
            )}
            onClick={() => {
              if (!value) {
                onValueChange("");
                setOpen(false);
              }
            }}
          >
            All {placeholder}s
          </div>
          {filteredOptions.length === 0 ? (
            <div className="px-2.5 py-1.5 text-sm text-muted-foreground">
              No results found.
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2.5 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  value === option.id && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  onValueChange(option.id);
                  setOpen(false);
                }}
              >
                {renderOption ? renderOption(option) : option.name}
                {value === option.id && (
                  <Check className="absolute right-2 size-3" />
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
