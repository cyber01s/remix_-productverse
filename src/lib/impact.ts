/**
 * Impact.com Affiliate Service
 * Handles deep link generation and reporting integration.
 */

// Removing env vars from client side, backend uses them
export const generateTrackingUrl = (baseUrl: string, subId1: string = 'productverse', subId2: string = '') => {
  // If the API returns a URL, it is likely already an Impact tracking link or a direct merchant link.
  // We append our subIds to it, rather than hardcoding a fake tracking domain.
  try {
    const url = new URL(baseUrl);
    if (subId1) url.searchParams.set('subId1', subId1);
    if (subId2) url.searchParams.set('subId2', subId2);
    return url.toString();
  } catch (e) {
    return baseUrl;
  }
};

export const logAffiliateClick = async (productId: string, metadata: any) => {
  try {
    const response = await fetch('/api/clicks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, ...metadata, timestamp: new Date().toISOString() }),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to log click:', error);
    return null;
  }
};

export const fetchProductFeed = async (options: { q?: string; category?: string; page?: number } = {}) => {
  console.log('Fetching impact.com product feed from backend proxy...');
  const params = new URLSearchParams();
  if (options.q) params.set('q', options.q);
  if (options.category && options.category !== 'all') params.set('category', options.category);
  if (options.page) params.set('page', options.page.toString());
  
  const url = `/api/products?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch products: ${errText}`);
  }
  const data = await res.json();
  return data.Items || data.items || [];
};

export const fetchProductById = async (id: string) => {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch product: ${errText}`);
  }
  return await res.json();
};
