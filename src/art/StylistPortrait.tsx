const hairByStylist: Record<string, string> = {
  naledi: "M30 52c0-22 14-34 30-34s30 12 30 34c0 8-2 14-4 18-2-14-10-26-26-26S36 56 34 70c-2-4-4-10-4-18zM44 22a16 16 0 1 1 32 0 16 16 0 0 1-32 0z",
  zara: "M28 92V54c0-22 14-36 32-36s32 14 32 36v38H80V58c0-12-8-20-20-20s-20 8-20 20v34z",
  ines: "M30 58c-4-24 10-40 30-40s34 16 30 40c-4-10-10-16-14-18-6 6-24 8-34 2-6 4-10 10-12 16z",
};

export function StylistPortrait({ stylistId, name }: { stylistId: string; name: string }) {
  return (
    <svg className="portrait" viewBox="0 0 120 120" role="img" aria-label={`Illustrated portrait of ${name}`}>
      <rect className="portrait-ground" x="0" y="0" width="120" height="120" rx="60" />
      <path className="portrait-body" d="M22 120c2-22 18-34 38-34s36 12 38 34z" />
      <rect className="portrait-neck" x="52" y="70" width="16" height="20" rx="6" />
      <ellipse className="portrait-face" cx="60" cy="56" rx="22" ry="25" />
      <path className="portrait-hair" d={hairByStylist[stylistId] ?? hairByStylist.naledi} />
    </svg>
  );
}
