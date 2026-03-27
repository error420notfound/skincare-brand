import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  site: 'https://error420notfound.github.io',
  base: '/<YOUR-REPO-NAME>',
});
