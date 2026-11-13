import type { IntervalType } from "@/lib/slots";

function _hashText(text: string): number {
  let hash = 2166136261;
  for (const character of text) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  return hash;
}

export function houseBlocksFor(stylistId: string, date: string, opensMinutes: number, closesMinutes: number): IntervalType[] {
  const seed = _hashText(`${stylistId}|${date}`);
  const blockCount = seed % 3;
  const halfHourCount = Math.floor((closesMinutes - opensMinutes) / 30);

  const result: IntervalType[] = [];
  for (let index = 0; index < blockCount; index++) {
    const pick = (seed >>> (8 + index * 8)) & 0xff;
    const startMinutes = opensMinutes + (pick % Math.max(halfHourCount - 2, 1)) * 30;
    const lengthMinutes = pick % 2 ? 90 : 60;
    result.push({ startMinutes, endMinutes: Math.min(startMinutes + lengthMinutes, closesMinutes) });
  }

  return result;
}
