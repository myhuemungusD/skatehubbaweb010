import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';

const sitemap = new SitemapStream({ hostname: 'https://skatehubba.com' });

// Add your pages here
const pages = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/demo', changefreq: 'monthly', priority: 0.8 },
  { url: '/new-landing', changefreq: 'monthly', priority: 0.9 },
];

// Write sitemap
sitemap.pipe(createWriteStream('./client/public/sitemap.xml'));

pages.forEach(page => sitemap.write(page));
sitemap.end();

console.log('✅ Sitemap generated at /sitemap.xml');