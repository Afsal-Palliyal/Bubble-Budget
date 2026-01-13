import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * Vite plugin that updates og:image and twitter:image meta tags
 * based on a public deployment URL.
 *
 * Requires: VITE_PUBLIC_URL environment variable
 */
export function metaImagesPlugin(): Plugin {
  return {
    name: 'vite-plugin-meta-images',
    transformIndexHtml(html) {
      const baseUrl = getPublicUrl();
      if (!baseUrl) {
        log('[meta-images] VITE_PUBLIC_URL not set, skipping meta tag updates');
        return html;
      }

      const publicDir = path.resolve(process.cwd(), 'client', 'public');

      const imageExt = findOpenGraphImage(publicDir);
      if (!imageExt) {
        log('[meta-images] OpenGraph image not found, skipping meta tag updates');
        return html;
      }

      const imageUrl = `${baseUrl}/opengraph.${imageExt}`;

      log('[meta-images] updating meta image tags to:', imageUrl);

      html = html.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/g,
        `<meta property="og:image" content="${imageUrl}" />`
      );

      html = html.replace(
        /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/g,
        `<meta name="twitter:image" content="${imageUrl}" />`
      );

      return html;
    },
  };
}

function getPublicUrl(): string | null {
  const url = process.env.VITE_PUBLIC_URL;
  if (!url) return null;
  return url.replace(/\/$/, ''); // remove trailing slash
}

function findOpenGraphImage(publicDir: string): 'png' | 'jpg' | 'jpeg' | null {
  const candidates: Array<'png' | 'jpg' | 'jpeg'> = ['png', 'jpg', 'jpeg'];

  for (const ext of candidates) {
    if (fs.existsSync(path.join(publicDir, `opengraph.${ext}`))) {
      return ext;
    }
  }

  return null;
}

function log(...args: any[]): void {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...args);
  }
}
