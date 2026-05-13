export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '') // Remove non-alphanumeric characters except spaces and hyphens
    .replace(/(\s+)/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
