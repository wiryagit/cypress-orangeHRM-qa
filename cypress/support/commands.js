// ***********************************************
// Custom Commands untuk OrangeHRM Admin User E2E Testing
// ***********************************************

/**
 * Login ke OrangeHRM menggunakan cy.session agar tidak perlu
 * login ulang di setiap test (lebih cepat & stabil).
 */
Cypress.Commands.add("loginAsAdmin", (username, password) => {
  const user = username || Cypress.env("adminUsername");
  const pass = password || Cypress.env("adminPassword");

  cy.session(
    [user, pass],
    () => {
      cy.visit("/web/index.php/auth/login");
      cy.get('input[name="username"]').should("be.visible").type(user);
      cy.get('input[name="password"]').should("be.visible").type(pass);
      cy.get('button[type="submit"]').click();
      cy.url().should("include", "/dashboard");
    },
    {
      validate() {
        cy.visit("/web/index.php/dashboard/index");
        cy.url().should("include", "/dashboard");
      },
    }
  );
});

/**
 * Klik menu "Admin" di sidebar dan pastikan halaman System Users terbuka.
 */
Cypress.Commands.add("goToAdminModule", () => {
  cy.get(".oxd-main-menu-item-wrapper").contains("Admin").click();
  cy.url().should("include", "/admin/viewSystemUsers");
  cy.get(".oxd-topbar-header-breadcrumb h6").should("contain.text", "Admin");
});

/**
 * Helper: isi input text berdasarkan teks label di atasnya.
 * OrangeHRM menggunakan struktur: .oxd-input-group > label.oxd-label + input
 */
Cypress.Commands.add("fillFieldByLabel", (labelText, value) => {
  cy.contains(".oxd-label", labelText)
    .parents(".oxd-input-group")
    .find("input")
    .clear()
    .type(value, { delay: 20 });
});

/**
 * Helper: pilih opsi pada custom dropdown (User Role / Status) berdasarkan
 * teks label di atasnya.
 */
Cypress.Commands.add("selectDropdownByLabel", (labelText, optionText) => {
  cy.contains(".oxd-label", labelText)
    .parents(".oxd-input-group")
    .find(".oxd-select-text")
    .click();

  cy.get(".oxd-select-dropdown")
    .should("be.visible")
    .contains(optionText)
    .click();
});

/**
 * Helper: isi Employee Name (autocomplete) dan pilih saran pertama
 * yang muncul dari hasil pencarian karyawan.
 */
Cypress.Commands.add("fillEmployeeNameAutocomplete", (employeeName) => {
  cy.contains(".oxd-label", "Employee Name")
    .parents(".oxd-input-group")
    .find("input")
    .type(employeeName, { delay: 50 });

  // Tunggu dropdown saran muncul lalu pilih opsi pertama.
  // Catatan: OrangeHRM merender opsi sebagai <div class="oxd-autocomplete-option">,
  // BUKAN <li>, sehingga selector di bawah menyesuaikan struktur tersebut.
  cy.get(".oxd-autocomplete-dropdown", { timeout: 10000 })
    .should("be.visible")
    .find(".oxd-autocomplete-option")
    .first()
    .should("be.visible")
    .click();
});
