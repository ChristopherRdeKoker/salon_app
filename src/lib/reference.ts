const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const MAX_ATTEMPTS = 50;

export const REFERENCE_PATTERN = /^HNY-[A-HJ-NP-Z2-9]{3}-[A-HJ-NP-Z2-9]{3}$/;

function _cryptoBytes(count: number): Uint8Array {
  const result = new Uint8Array(count);
  crypto.getRandomValues(result);
  return result;
}

export function makeReference(taken: ReadonlySet<string>, randomBytes: (count: number) => Uint8Array = _cryptoBytes): string {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = Array.from(randomBytes(6), (byte) => REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length]).join("");
    const reference = `HNY-${code.slice(0, 3)}-${code.slice(3)}`;
    if (!taken.has(reference)) return reference;
  }
  throw new Error(`Could not generate a unique booking reference after ${MAX_ATTEMPTS} attempts`);
}
