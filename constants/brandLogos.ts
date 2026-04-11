/**
 * Brand logo override registry.
 *
 * To use a LOCAL high-quality logo for a brand:
 * 1. Drop a PNG into `assets/brands/` (e.g., assets/brands/nike.png)
 * 2. Uncomment the matching line below
 * 3. Local files take priority over the remote Clearbit fallback
 *
 * If a domain is not listed here, BrandLogo automatically tries:
 *   1. https://logo.clearbit.com/{domain}?size=256
 *   2. https://www.google.com/s2/favicons?domain={domain}&sz=128
 *   3. brand initials
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BRAND_LOGO_OVERRIDES: Record<string, any> = {
  // 'nike.com': require('../assets/brands/nike.png'),
  // 'adidas.com': require('../assets/brands/adidas.png'),
  // 'coca-cola.com': require('../assets/brands/coca-cola.png'),
  // 'renault.com': require('../assets/brands/renault.png'),
  // 'samsung.com': require('../assets/brands/samsung.png'),
};
