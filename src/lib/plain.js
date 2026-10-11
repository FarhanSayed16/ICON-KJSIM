/** Deep-clone to plain JSON-safe values for RSC → client props. */
export function toPlain(value) {
  return JSON.parse(JSON.stringify(value ?? null));
}
