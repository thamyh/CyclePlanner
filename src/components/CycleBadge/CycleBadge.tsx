// src/components/CycleBadge/CycleBadge.tsx
import React from "react";
import { Split } from "@/lib/types";

interface Props {
  label: string;
  split: Split;
}

export default function CycleBadge({ label, split }: Props) {
  const bg = split.colors?.[label] ?? defaultPalette[label] ?? "#555";
  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white shadow"
      style={{ backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

const defaultPalette: Record<string, string> = {
  Push: "hsl(0, 70%, 55%)",
  Pull: "hsl(220, 70%, 55%)",
  Legs: "hsl(120, 70%, 45%)",
  Rest: "hsl(0, 0%, 45%)",
};
