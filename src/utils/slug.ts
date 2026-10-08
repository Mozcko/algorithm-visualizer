// src/utils/slug.ts

// Convierte una categoría ('Data Structures') en un segmento de URL ('data-structures')
export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}
