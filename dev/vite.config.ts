import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [tsconfigPaths()],
  optimizeDeps: {
    exclude: ['@antv/infographic', '@antv/hierarchy'],
  },
});
