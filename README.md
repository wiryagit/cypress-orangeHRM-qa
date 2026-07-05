# Cypress E2E - OrangeHRM Admin User Management

Project automasi pengujian **UI E2E** menggunakan Cypress (JavaScript) untuk situs demo
[OrangeHRM](https://opensource-demo.orangehrmlive.com/).

Project ini adalah hasil modifikasi dari template Cypress sebelumnya
(`cypress-gorest-api-testing`, testing API GoRest) yang diubah total menjadi
UI testing OrangeHRM sesuai requirement task baru. Koneksi Git ke repository
lama sudah dilepas — silakan hubungkan ke repository GitHub baru (lihat bagian
**Setup Git & GitHub** di bawah).

## Fitur yang Diuji

1. **Login** — akses URL demo, login dengan kredensial `Admin` / `admin123`,
   verifikasi redirect ke `/dashboard`, screenshot halaman Dashboard.
2. **Validasi Dashboard** — memastikan widget-widget utama Dashboard tampil.
3. **Akses Menu Admin** — klik menu Admin di sidebar, validasi halaman System
   Users, screenshot.
4. **Add Admin User** — klik tombol Add, validasi form (termasuk validasi
   field required), isi form dengan data valid, klik Save, screenshot di
   setiap tahap.
5. **Verifikasi user baru** — cari user yang baru dibuat melalui fitur
   search/filter di tabel System Users, screenshot hasil.

## Struktur Project

```
orangehrm-admin-user-e2e/
├── cypress/
│   ├── e2e/
│   │   └── admin-user-management.cy.js   # Semua test case (5 langkah di atas)
│   ├── fixtures/
│   │   └── newAdminUser.json             # Data user baru (role, employee, status, password)
│   ├── support/
│   │   ├── commands.js                   # Custom command (loginAsAdmin, goToAdminModule, dll)
│   │   └── e2e.js
│   └── screenshots/                      # Hasil screenshot (otomatis dibuat, di-gitignore)
├── cypress.config.js
├── cypress.env.json.example
├── package.json
└── .gitignore
```

## Custom Commands (`cypress/support/commands.js`)

| Command | Fungsi |
|---|---|
| `cy.loginAsAdmin(username, password)` | Login dan cache session (pakai `cy.session`) agar test lebih cepat |
| `cy.goToAdminModule()` | Klik menu Admin di sidebar + validasi URL |
| `cy.fillFieldByLabel(label, value)` | Isi input text berdasarkan label (Username, Password, dst) |
| `cy.selectDropdownByLabel(label, option)` | Pilih opsi pada custom dropdown OrangeHRM (User Role, Status) |
| `cy.fillEmployeeNameAutocomplete(name)` | Isi field Employee Name (autocomplete) & pilih saran pertama |

> Catatan: OrangeHRM memakai komponen custom (bukan `<select>` HTML biasa),
> sehingga dibutuhkan helper command khusus di atas alih-alih `cy.get(...).select(...)`.

## Instalasi

```bash
npm install
```

## Menjalankan Test

**Mode interaktif (GUI):**
```bash
npm run cy:open
```

**Mode headless (terminal):**
```bash
npm run cy:run
```

Hasil screenshot headless akan otomatis tersimpan di folder `cypress/screenshots/`
(nama file sesuai spec + nama test), contoh:
```
cypress/screenshots/admin-user-management.cy.js/01-dashboard-after-login.png
cypress/screenshots/admin-user-management.cy.js/03-admin-system-users-page.png
cypress/screenshots/admin-user-management.cy.js/06-add-user-form-filled.png
cypress/screenshots/admin-user-management.cy.js/08-new-user-found-in-table.png
```

## Setup Git & GitHub (Repository Baru)

Folder ini sudah diberikan sebagai **project bersih tanpa riwayat Git** (tidak
terhubung ke repo lama `cypress-gorest-qa`). Untuk menghubungkannya ke
repository GitHub baru:

1. Buat repository baru di GitHub (kosong, tanpa README/gitignore), misal:
   `cypress-orangehrm-admin-user-e2e`.
2. Di terminal VS Code, jalankan di dalam folder project ini:

```bash
git init
git add .
git commit -m "Initial commit: Cypress E2E OrangeHRM Admin User Management"
git branch -M main
git remote add origin https://github.com/<username-anda>/cypress-orangehrm-admin-user-e2e.git
git push -u origin main
```

Jika Anda menggunakan GitHub CLI (`gh`) dan sudah login (`gh auth login`),
Anda juga bisa langsung membuat & push repo baru dengan satu perintah:

```bash
gh repo create cypress-orangehrm-admin-user-e2e --public --source=. --remote=origin --push
```

## Catatan Penting

- Selector di test ini mengikuti struktur halaman OrangeHRM demo per Juli 2026.
  Karena ini adalah situs demo publik, struktur elemen bisa berubah sewaktu-waktu —
  jika ada test yang gagal karena elemen tidak ditemukan, cek kembali selector
  terkait di `commands.js` / spec file.
- Username user baru dibuat unik otomatis (`qa_admin_<timestamp>`) di setiap
  run, supaya test bisa dijalankan berulang kali tanpa bentrok "Username
  already exists".
- Password default di `cypress/fixtures/newAdminUser.json` sudah memenuhi
  syarat kompleksitas OrangeHRM (huruf, angka, simbol, minimal 7 karakter).
