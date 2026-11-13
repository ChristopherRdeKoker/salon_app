import { cn } from "@/lib/cn";

const iconPaths = {
  polish: "M10 3h4v5h-4zM8.5 8h7a1.5 1.5 0 0 1 1.5 1.5V19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.5A1.5 1.5 0 0 1 8.5 8zM9.5 13h5",
  lash: "M3 13c4.5 4.5 13.5 4.5 18 0M6 15.5 4.5 18M9.5 16.8 9 19.5M14.5 16.8l.5 2.7M18 15.5l1.5 2.5M5 10c3-3.5 11-3.5 14 0",
  leaf: "M5 19c0-8 5-14 14-14 0 9-6 14-14 14zM5 19 13 11",
  drop: "M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5zM9.5 14.5a2.5 2.5 0 0 0 2.5 2.5",
  clock: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM12 7.5V12l3 2",
  calendar: "M4 6.5h16v13H4zM4 10.5h16M8 4v4m8-4v4",
  pin: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  person: "M12 11.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5",
  chevronLeft: "M15 5l-7 7 7 7",
  chevronRight: "M9 5l7 7-7 7",
  check: "M5 12.5l4.5 4.5L19 7.5",
  close: "M6 6l12 12M18 6 6 18",
  plus: "M12 5v14M5 12h14",
} as const;

export type IconNameType = keyof typeof iconPaths;

export const categoryIcons: Record<string, IconNameType> = {
  nails: "polish",
  "lashes-brows": "lash",
  facials: "leaf",
  waxing: "drop",
};

export function Icon({ name, className }: { name: IconNameType; className?: string }) {
  return (
    <svg className={cn("icon", className)} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={iconPaths[name]} />
    </svg>
  );
}
