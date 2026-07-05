const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    // Screenshot otomatis diambil saat test gagal (tambahan di luar screenshot manual di setiap laman)
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    video: false,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      return config;
    },
  },
  env: {
    // Kredensial default sesuai requirement task.
    // Untuk data sensitif di project nyata, sebaiknya pindahkan ke cypress.env.json (sudah di-gitignore)
    adminUsername: "Admin",
    adminPassword: "admin123",
  },
});
