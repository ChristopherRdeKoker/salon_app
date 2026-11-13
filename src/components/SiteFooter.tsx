import { HexMark } from "@/art/HexMark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="footer-name">
          <HexMark className="hex-mark-small" />
          Honeycomb
        </p>
        <p>A fictional beauty studio made for a portfolio. The studio, therapists, prices and appointments are invented, and bookings stay in this browser.</p>
      </div>
    </footer>
  );
}
