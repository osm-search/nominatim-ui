import { defineConfig } from '@playwright/test';

const testing_port = 9999;

export default defineConfig({
  testDir: './test',
  testMatch: '**/*.spec.js',
  timeout: 10_000,
  globalSetup: './test/global-setup.js',
  globalTeardown: './test/global-teardown.js',
  reporter: 'list',

  use: {
    baseURL: `http://localhost:${testing_port}`,
    viewport: { width: 1024, height: 768 },
    userAgent:
      'Nominatim UI test suite Mozilla/5.0 Gecko/20100101 HeadlessChrome/90.0',
    bypassCSP: true,
    launchOptions: {
      args: ['--disable-web-security'],
    },
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],

  fullyParallel: false,
  workers: 1,
});
