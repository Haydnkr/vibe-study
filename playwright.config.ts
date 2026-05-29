import { defineConfig, devices } from '@playwright/test';

/**
 * Travel Map E2E config.
 * - 정적 export 앱이지만 개발 편의를 위해 `next dev`를 webServer로 띄운다.
 * - 각 테스트는 격리된 브라우저 컨텍스트(빈 localStorage)에서 실행된다.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
