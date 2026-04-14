# Issue: Implementasi Fitur Registrasi User

## Deskripsi
Kita perlu menambahkan fitur registrasi user baru ke dalam aplikasi. Fitur ini mencakup pembuatan tabel `users` di database dan pembuatan API endpoint untuk menangani pendaftaran.

## Spesifikasi Database
Buat tabel `users` dengan skema berikut:
- `id`: integer, auto increment, primary key
- `firstname`: varchar(255), not null
- `lastname`: varchar(255), not null
- `email`: varchar(255), not null, unique
- `password`: varchar(255), not null (password **harus** di-hash menggunakan bcrypt sebelum disimpan)
- `created_at`: timestamp, default current_timestamp
- `updated_at`: timestamp, default current_timestamp

## Spesifikasi API
Buat endpoint API untuk registrasi user baru:

- **Endpoint**: `POST /api/v1/users`
- **Request Body**:
  ```json
  {
      "firstname": "John",
      "lastname": "Doe",
      "email": "johndoe@example.com",
      "password": "password"
  }
  ```

- **Response Body (Success)**:
  ```json
  {
      "message": "User created successfully",
      "data": {
          "id": 1,
          "firstname": "John",
          "lastname": "Doe",
          "email": "johndoe@example.com",
          "created_at": "2022-01-01T00:00:00.000Z",
          "updated_at": "2022-01-01T00:00:00.000Z"
      }
  }
  ```
  *(Catatan: Pastikan field `password` tidak ikut dikembalikan/diekspos dalam response `data`)*

- **Response Body (Error - Email sudah terdaftar)**:
  ```json
  {
      "message": "User already exists",
      "error": "Bad Request"
  }
  ```

## Struktur File dan Folder
Ikuti struktur folder dan penamaan file berikut di dalam folder `src`:
- `src/routes/`: Berisi definis routing dari Express.js.
  - Penamaan file harus menggunakan format: `users-route.ts`
- `src/services/`: Berisi logic bisnis aplikasi (seperti validasi ketersediaan email, hashing, dan manipulasi ke database).
  - Penamaan file harus menggunakan format: `users-service.ts`

## Tahapan Implementasi

Silakan ikuti instruksi dan urutan langkah-langkah berikut untuk mengimplementasikan fitur ini:

1. **Persiapan Skema Database**
   - Definisikan bagan/skema tabel `users` pada level aplikasi (misalnya pada file schema ORM Anda) sesuai dengan spesifikasi kolom di atas.
   - Aplikasikan skema tersebut ke database (misalnya dengan menjalankan script migration atau push schema) agar tabel baru tersebut tersedia di database.

2. **Implementasi Logic Bisnis (Service)**
   - Buat file baru pada `src/services/users-service.ts`.
   - Buat logic pendaftaran user yang menangani input: `firstname`, `lastname`, `email`, dan `password`.
   - Di dalam fungsi ini, pertama lakukan pengecekan apakah user dengan email tersebut sudah terdaftar di database.
   - Jika email sudah ada, throw/lempar sebuah error.
   - Jika email balum ada, enkripsi nilai `password` menggunakan library `bcrypt`.
   - Simpan data user baru tersebut ke dalam database menggunakan password yang sudah di-hash.
   - Return/kembalikan data user yang sukses dibuat tanpa menyertakan raw atau hashed password.

3. **Implementasi Routing (Route/Controller)**
   - Buat file baru pada `src/routes/users-route.ts`.
   - Definisikan endpoint `POST /` atau `POST /api/v1/users` (tergantung bagaimana prefix routing utama aplikasi Anda disetel) pada instance Express Router.
   - Ekstrak nilai yang dikirim oleh klien dari req body.
   - Panggil service yang sudah dibuat pada langkah 2, berikan data input tersebut padanya.
   - Apabila pemanggilan service berhasil, balas request dengan format JSON response "success" seperti spesifikasi di atas beserta HTTP kode sukses.
   - Jika service menghasilkan error (khususnya karena email duplicate), tangkap error tersebut dan balas dengan format JSON response "error" sesuai ketentuan di atas, yang merepresentasikan respon HTTP 400 Bad Request.

4. **Pendaftaran Route ke Aplikasi**
   - Buka file routing utama pada aplikasi, lalu export dan sambungkan `users-route.ts` agar aplikasi Express dapat mengenali alamat endpoint pendaftaran user baru tersebut.

5. **Pengujian Internal (Verifikasi)**
   - Jalankan server lokal.
   - Hit endpoint POST menggunakan aplikasi HTTP Client (seperti cURL, Postman, Bruno dsb).
   - Validasi kedua skenario: apakah registrasi sukses membuat record baru tanpa menyimpan password "telanjang", dan apakah mendaftar kembali dengan email yang sama bisa terhalang oleh pesan error yang spesifik.
