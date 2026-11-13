import { hexPoints } from "@/art/hex";

export function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 400 440" role="img" aria-label="Illustration of a nail polish bottle, a frangipani flower and a curled lash on a blush arch, with small gold honeycomb cells">
      <path className="art-arch" d="M40 440V200a160 160 0 0 1 320 0v240z" />
      <path className="art-arch-line" d="M64 440V204a136 136 0 0 1 272 0v236" />
      <ellipse className="art-shadow" cx="200" cy="404" rx="150" ry="14" />
      <g transform="translate(118 196)">
        <rect className="art-cap" x="22" y="0" width="40" height="78" rx="6" />
        <rect className="art-cap-band" x="18" y="70" width="48" height="14" rx="4" />
        <path className="art-bottle" d="M10 92h64a12 12 0 0 1 12 12v86a20 20 0 0 1-20 20H18a20 20 0 0 1-20-20v-86a12 12 0 0 1 12-12z" />
        <path className="art-gloss" d="M14 112v70" />
        <path className="art-gloss" d="M24 112v28" />
      </g>
      <g className="art-flower" transform="translate(268 318)">
        <ellipse className="art-petal" rx="22" ry="48" transform="rotate(0) translate(0 -40)" />
        <ellipse className="art-petal" rx="22" ry="48" transform="rotate(72) translate(0 -40)" />
        <ellipse className="art-petal" rx="22" ry="48" transform="rotate(144) translate(0 -40)" />
        <ellipse className="art-petal" rx="22" ry="48" transform="rotate(216) translate(0 -40)" />
        <ellipse className="art-petal" rx="22" ry="48" transform="rotate(288) translate(0 -40)" />
        <circle className="art-heart" r="14" />
      </g>
      <g className="art-lash" transform="translate(196 104)">
        <path d="M0 40c30 26 100 26 130 0" />
        <path d="M14 50 4 68M38 58l-4 20M65 61v21M92 58l4 20M116 50l10 18" />
      </g>
      <g className="art-comb">
        <polygon className="art-cell-solid" points={hexPoints(80, 146, 13)} />
        <polygon className="art-cell" points={hexPoints(106, 146, 12)} />
        <polygon className="art-cell" points={hexPoints(93, 168.5, 12)} />
        <polygon className="art-cell" points={hexPoints(67, 168.5, 12)} />
      </g>
      <polygon className="art-cell" points={hexPoints(334, 210, 8)} />
    </svg>
  );
}
