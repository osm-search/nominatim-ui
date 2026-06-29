import { defineConfig } from '@playwright/test';

const testing_port = 9999;

export default defineConfig({
  testDir: './test',
  testMatch: '**/*.spec.js',
  timeout: 30_000,
  // The suite hits the live, rate-limited nominatim.openstreetmap.org API, so
  // an occasional slow response is expected on CI. Retry there to absorb it;
  // keep 0 locally so flakiness stays visible during development.
  retries: process.env.CI ? 2 : 0,
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
