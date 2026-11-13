export function cn(...classes: (string | false | null | undefined)[]): string {
  const result = classes.filter(Boolean).join(" ");
  return result;
}
