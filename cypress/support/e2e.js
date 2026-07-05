import "./commands";

// Mencegah test gagal hanya karena error JS/uncaught exception yang tidak
// relevan dengan flow yang sedang diuji (umum terjadi di demo site OrangeHRM).
Cypress.on("uncaught:exception", () => {
  return false;
});
