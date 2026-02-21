import fs from 'fs';
import path from 'path';

const API_URL = process.env.VITE_API_URL || 'https://ecom-watch.onrender.com/api/v1';
const BASE_URL = process.env.VITE_SITE_URL || 'https://ecom-watch.fr';
const OUTPUT_PATH = path.resolve('./public/sitemap-products.xml');
const TODAY = new Date().toISOString().split('T')[0];

async function fetchAllProducts() {
    const response = await fetch(`${API_URL}/products?limit=1000`);
    const data = await response.json();
    return data?.data?.products || data?.data || [];
}

function escapeXml(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function main() {
    const products = await fetchAllProducts();

    const urls = products.filter(p => p.slug).map(p => `
  <url>
    <loc>${BASE_URL}/product/${escapeXml(p.slug)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Généré le ${TODAY} — ${products.length} produits -->${urls}
</urlset>`;

    fs.writeFileSync(OUTPUT_PATH, xml, 'utf-8');
    console.log(`✅ sitemap-products.xml généré (${products.length} produits)`);
}

main();