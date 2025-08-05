export function toUrlSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')       // Remove non-word characters except spaces and dashes
    .replace(/\s+/g, '-')           // Replace spaces with dashes
    .replace(/-+/g, '-')            // Collapse multiple dashes
    .trim()
}
