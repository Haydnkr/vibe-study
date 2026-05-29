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
    // next dev는 /app을 온디맨드 컴파일하므로 첫 네비게이션이 느릴 수 있다.
    // 동시 cold 요청이 기본 30s를 넘겨 플레이크가 생기는 것을 방지.
    navigationTimeout: 60_000,
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
