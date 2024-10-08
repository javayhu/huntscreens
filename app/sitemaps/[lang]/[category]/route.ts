import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { locales, SupportedLangs } from '@/i18n/types';
import { ProductTypes, productTypes, urlMapper } from '@/types/product.types';
import { visibleProducts } from '@/db/schema/views/visible.products';

export async function GET(
  request: Request,
  { params }: { params: { category: ProductTypes; lang: SupportedLangs } }
) {
  const { category, lang } = params;
  if (!productTypes.includes(category) || !locales.includes(lang)) {
    return new Response('Not found', { status: 404 });
  }

  const items = await db.select({
    id: visibleProducts.id,
    launch_date: visibleProducts.launched_at
  })
  .from(visibleProducts).where(eq(visibleProducts.itemType, category));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${items.map(item => `
    <url>
      <loc>https://huntscreens.com${urlMapper[category](item.id!, lang)}</loc>
      <lastmod>${item.launch_date || new Date().toISOString()}</lastmod>
      ${locales.map(locale => `
        <xhtml:link 
           rel="alternate" 
           hreflang="${locale}" 
           href="https://huntscreens.com${urlMapper[category](item.id!, locale)}"
        />`).join('')}
    </url>
  `).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    },
  });
}

export async function generateStaticParams() {
  return productTypes.flatMap(category => 
    locales.map(lang => ({
      category,
      lang
    }))
  );
}