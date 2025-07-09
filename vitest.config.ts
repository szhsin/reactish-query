import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    environment: 'jsdom',
    include: ['src/__tests__/**/*.test.[jt]s?(x)'],
    coverage: {
      enabled: true,
      provider: 'istanbul',
      include: ['src/'],
      exclude: ['src/__tests__', 'src/index.ts']
    },
    setupFiles: ['@testing-library/jest-dom']
  }
});
