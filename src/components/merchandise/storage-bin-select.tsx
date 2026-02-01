"use client";

import { Select } from "@/components/ui/select";
import { STORAGE_BINS } from "@/lib/constants";

interface StorageBinSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  showAll?: boolean;
}

export function StorageBinSelect({
  value,
  onChange,
  label,
  required,
  showAll = false,
}: StorageBinSelectProps) {
  return (
    <Select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      {showAll && <option value="">All Boxes</option>}
      {!showAll && <option value="">Select a box</option>}
      {STORAGE_BINS.map((bin) => (
        <option key={bin} value={bin}>
          {bin}
        </option>
      ))}
    </Select>
  );
}
