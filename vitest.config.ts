import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // `.claude/worktrees/**` holds checkouts of this same repo, so without it every
    // test file is collected twice and the reported total silently doubles.
    exclude: ['**/node_modules/**', '**/tests/**', '**/*.spec.ts', '**/.claude/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
