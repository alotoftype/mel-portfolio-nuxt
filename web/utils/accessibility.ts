export function safeAlt(primary?: string | null, fallback = "Image") {
  const value = typeof primary === "string" ? primary.trim() : "";
  return value || fallback;
}
