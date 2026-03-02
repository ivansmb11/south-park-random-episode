/**
 * TMDB Image sizes available
 */
export type TMDBImageSize = 
  | 'w92' 
  | 'w154' 
  | 'w185' 
  | 'w342' 
  | 'w500' 
  | 'w780' 
  | 'w1280'
  | 'original';

/**
 * TMDB backdrop sizes available
 */
export type TMDBBackdropSize = 
  | 'w300' 
  | 'w780' 
  | 'w1280' 
  | 'original';

/**
 * Base URL for TMDB images
 */
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

/**
 * Creates a full TMDB image URL from a path and size
 * @param path - The image path from TMDB API (e.g., "/abc123.jpg")
 * @param size - The desired image size (default: "w185")
 * @returns Full TMDB image URL or null if path is invalid
 */
export function getTMDBImageUrl(
  path: string | null | undefined, 
  size: TMDBImageSize = 'w185'
): string | null {
  if (!path || !path.trim()) {
    return null;
  }
  
  // Ensure path starts with "/"
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${TMDB_IMAGE_BASE_URL}${size}${cleanPath}`;
}

/**
 * Creates a full TMDB backdrop image URL from a path and size
 * @param path - The backdrop path from TMDB API
 * @param size - The desired backdrop size (default: "w780")
 * @returns Full TMDB backdrop URL or null if path is invalid
 */
export function getTMDBBackdropUrl(
  path: string | null | undefined,
  size: TMDBBackdropSize = 'w780'
): string | null {
  if (!path || !path.trim()) {
    return null;
  }
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${TMDB_IMAGE_BASE_URL}${size}${cleanPath}`;
}

/**
 * Get multiple sizes of the same image for responsive images
 * @param path - The image path from TMDB API
 * @param sizes - Array of sizes to generate URLs for
 * @returns Object with size keys and URL values
 */
export function getTMDBImageSrcSet(
  path: string | null | undefined,
  sizes: TMDBImageSize[] = ['w185', 'w342', 'w500']
): Record<TMDBImageSize, string | null> {
  const result = {} as Record<TMDBImageSize, string | null>;
  
  sizes.forEach(size => {
    result[size] = getTMDBImageUrl(path, size);
  });
  
  return result;
}

/**
 * Generate a srcset string for responsive images
 * @param path - The image path from TMDB API
 * @param sizes - Array of sizes with their corresponding widths
 * @returns srcset string for use in img elements
 */
export function generateSrcSet(
  path: string | null | undefined,
  sizes: Array<{ size: TMDBImageSize; width: number }> = [
    { size: 'w185', width: 185 },
    { size: 'w342', width: 342 },
    { size: 'w500', width: 500 }
  ]
): string | null {
  if (!path) return null;
  
  const srcSetParts = sizes
    .map(({ size, width }) => {
      const url = getTMDBImageUrl(path, size);
      return url ? `${url} ${width}w` : null;
    })
    .filter(Boolean);
    
  return srcSetParts.length > 0 ? srcSetParts.join(', ') : null;
}