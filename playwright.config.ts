import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PORT ?? 3210)
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  /* Against the production build, not the dev server: the image budget, the print
     stylesheet and the scroll-driven progress bar all behave differently under dev
     instrumentation, and it is the shipped bundle that has to hold. */
  webServer: {
    command: `npm run build && npx next start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 240_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
  projects: [
    {
      name: 'chromium',
      /* Playwright's bundled chromium revision is mismatched on this machine, so the
         project runs against installed Chrome instead. */
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
})
