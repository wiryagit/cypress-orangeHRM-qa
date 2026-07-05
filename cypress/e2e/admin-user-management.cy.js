/// <reference types="cypress" />

// ==========================================================================
// E2E Test: OrangeHRM - Login, Menu Admin, Tambah Admin User, Validasi Dashboard
// ==========================================================================
//
// Flow pengujian:
// 1. Login menggunakan kredensial Admin
// 2. Verifikasi redirect ke /dashboard + screenshot
// 3. Buka menu Admin di sidebar + validasi halaman + screenshot
// 4. Tambah Admin User baru (isi & validasi form) + screenshot hasil
// 5. Verifikasi user baru muncul di tabel System Users (via search/filter)

describe("OrangeHRM - Admin User Management E2E", () => {
  let userData;
  // Username dibuat unik setiap run agar tidak bentrok dengan data sebelumnya
  const uniqueUsername = `qa_admin_${Date.now()}`;

  before(() => {
    cy.fixture("newAdminUser").then((data) => {
      userData = data;
    });
  });

  beforeEach(() => {
    // Login sekali (di-cache oleh cy.session), lalu pastikan mulai dari dashboard
    cy.loginAsAdmin();
    cy.visit("/web/index.php/dashboard/index");
  });

  it("1. Login - harus berhasil redirect ke Dashboard", () => {
    cy.url().should("include", "/dashboard");

    // Validasi elemen khas halaman Dashboard benar-benar tampil
    cy.get(".oxd-topbar-header-breadcrumb h6").should(
      "contain.text",
      "Dashboard"
    );
    cy.contains(".oxd-topbar-header-breadcrumb-module", "Dashboard").should(
      "be.visible"
    );

    cy.screenshot("01-dashboard-after-login");
  });

  it("2. Dashboard - widget utama harus tampil dengan benar", () => {
    // Validasi beberapa widget umum yang ada di Dashboard OrangeHRM
    cy.get(".oxd-layout-context").should("be.visible");
    cy.get(".orangehrm-dashboard-grid").should("exist");
    cy.contains("h6", "Time at Work").should("be.visible");
    cy.contains("h6", "My Actions").should("be.visible");

    cy.screenshot("02-dashboard-widgets-validated");
  });

  it("3. Akses Menu Admin - harus menampilkan halaman System Users", () => {
    cy.goToAdminModule();

    // Validasi elemen-elemen kunci halaman Admin
    cy.get(".oxd-table-filter").should("be.visible");
    cy.contains("button", "Add").should("be.visible");
    cy.get(".oxd-table-header").should("be.visible");
    cy.get(".oxd-table-body").should("exist");

    cy.screenshot("03-admin-system-users-page");
  });

  it("4. Add Admin User - mengisi form, validasi field, dan menyimpan", () => {
    cy.goToAdminModule();

    // Klik tombol Add
    cy.contains("button", "Add").click();
    cy.url().should("include", "/admin/saveSystemUser");
    cy.contains("h6", "Add User").should("be.visible");
    cy.screenshot("04-add-user-form-empty");

    // --- Validasi: submit form kosong harus memunculkan pesan required ---
    cy.contains("button", "Save").click();
    cy.get(".oxd-input-group__message")
      .should("have.length.greaterThan", 0)
      .and("contain.text", "Required");
    cy.screenshot("05-add-user-form-validation-required");

    // --- Isi form dengan data valid ---
    cy.selectDropdownByLabel("User Role", userData.userRole);
    cy.fillEmployeeNameAutocomplete(userData.employeeName);
    cy.selectDropdownByLabel("Status", userData.status);
    cy.fillFieldByLabel("Username", uniqueUsername);
    cy.fillFieldByLabel("Password", userData.password);
    cy.fillFieldByLabel("Confirm Password", userData.password);

    cy.screenshot("06-add-user-form-filled");

    // --- Validasi tambahan: pastikan tidak ada pesan error tersisa sebelum Save ---
    cy.get(".oxd-input-field-error-message").should("not.exist");

    // Klik Save
    cy.contains("button", "Save").click();

    // Setelah save, harus kembali ke halaman System Users
    cy.url().should("include", "/admin/viewSystemUsers");
    cy.screenshot("07-after-save-back-to-system-users");
  });

  it("5. Verifikasi user baru muncul di tabel System Users (via search)", () => {
    cy.goToAdminModule();

    // Filter/search berdasarkan username yang baru dibuat
    cy.contains(".oxd-label", "Username")
      .parents(".oxd-input-group")
      .find("input")
      .type(uniqueUsername);

    cy.contains("button", "Search").click();

    // Tunggu tabel selesai loading, lalu validasi hasil pencarian
    cy.get(".oxd-table-body", { timeout: 10000 }).should("be.visible");
    cy.get(".oxd-table-body .oxd-table-row").should("have.length", 1);
    cy.get(".oxd-table-body .oxd-table-row")
      .first()
      .should("contain.text", uniqueUsername)
      .and("contain.text", userData.userRole)
      .and("contain.text", userData.status);

    cy.screenshot("08-new-user-found-in-table");
  });
});
