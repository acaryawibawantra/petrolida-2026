/**
 * Transform asset URL to use the correct API base URL based on environment
 *
 * Example:
 * Input: "https://api.petrolida.com/api/v1/product/assets/xxx"
 * Output (dev): "https://dev-api.petrolida.com/api/v1/product/assets/xxx"
 * Output (prod): "https://api.petrolida.com/api/v1/product/assets/xxx"
 */
export function getAssetUrl(originalUrl: string | undefined | null): string {
  if (!originalUrl) return "/placeholder-product.png";

  const isDev = process.env.NEXT_PUBLIC_RUN_MODE === "development";
  const baseUrl = isDev
    ? process.env.NEXT_PUBLIC_API_URL_DEV
    : process.env.NEXT_PUBLIC_API_URL_PROD;

  // Remove trailing slash from baseUrl if exists
  const cleanBaseUrl = baseUrl?.replace(/\/$/, "") || "";

  // Extract the path from the original URL (everything after the domain)
  // Original: "https://api.petrolida.com/api/v1/product/assets/xxx"
  // Path: "/api/v1/product/assets/xxx"
  try {
    const url = new URL(originalUrl);
    const path = url.pathname + url.search;
    return `${cleanBaseUrl}${path}`;
  } catch {
    // If URL parsing fails, return original
    return originalUrl;
  }
}

/**
 * Get the current API base URL based on environment
 */
export function getApiBaseUrl(): string {
  const isDev = process.env.NEXT_PUBLIC_RUN_MODE === "development";
  const baseUrl = isDev
    ? process.env.NEXT_PUBLIC_API_URL_DEV
    : process.env.NEXT_PUBLIC_API_URL_PROD;

  return baseUrl?.replace(/\/$/, "") || "";
}
