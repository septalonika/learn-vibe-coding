# Implementasi Unit Test untuk Semua Endpoint API

Tugas ini bertujuan untuk menambahkan *unit tests* menggunakan `bun test` guna memastikan semua endpoint API berjalan dengan baik dan konsisten. Semua *unit tests* harus ditempatkan di dalam folder `tests/`.

## Aturan Utama
1. **Framework Pengujian:** Menggunakan `bun test`.
2. **Lokasi File:** Buat folder `tests/` di root proyek dan simpan semua file test di dalamnya (contoh: `tests/users.test.ts`).
3. **Konsistensi Data:** Sebelum setiap skenario pengujian dijalankan, **wajib** melakukan *clear data* (menghapus data dummy/test) di database agar *state* pengujian selalu dimulai dari keadaan bersih dan konsisten.

## Skenario yang Harus Diuji

Tugas kamu adalah mengimplementasikan detail kode pengujian untuk skenario-skenario berikut selengkap mungkin:

### 1. Register API (`POST /api/v1/users`)
- Sukses mendaftarkan user baru dengan input data yang valid.
- Gagal mendaftar (error 400) ketika mendaftarkan email yang sudah teregistrasi sebelumnya.
- Gagal mendaftar (error 400/Validation Error) ketika input ada yang kosong, tidak lengkap, format email tidak valid, atau password kurang dari batas minimum karakter.
- Gagal mendaftar (error 400/Database) ketika memasukkan field string (`firstname`, `lastname`, `email`, atau `password`) yang melebihi batas 255 karakter.

### 2. Login API (`POST /api/v1/users/login`)
- Sukses login dengan `email` dan `password` yang valid (memastikan API tersebut mengembalikan sebuah token).
- Gagal login (error 400) menggunakan email yang tidak terdaftar.
- Gagal login (error 400) menggunakan email yang terdaftar tapi kombinasi password salah.
- Gagal login (Validation Error) jika format email atau input payload salah strukturnya.

### 3. Get Current User API (`GET /api/v1/users/current`)
- Sukses menerima detail current user ketika berhasil mengirimkan valid token.
- Gagal mendapat detail user (error 401/Unauthorized) jika dipanggil tanpa mem-passing token.
- Gagal mendapat detail user (error 401/Unauthorized) jika mem-passing token yang invalid atau token sudah terhapus.

### 4. Logout API (`DELETE /api/v1/users/logout`)
- Sukses melakukan logout dan menghapus/menghanguskan token session spesifik tersebut di database.
- Gagal melakukan logout (error 401/Unauthorized) apabila request dikirimkan tanpa *Authorization token*.
- Gagal melakukan logout (error 401/Unauthorized) apabila mengirimkan token *invalid* yang tidak ada di database.

---
**Catatan untuk Implementator:**
Implementasikan spesifikasi setup/teardown untuk testing ke database langsung di atas, penuhi semua skenario, dan pastikan pengujian dapat di jalankan via perintah `bun test`.
