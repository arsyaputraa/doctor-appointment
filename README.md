# doctor-appointment

Doctor Appointment adalah aplikasi sistem informasi dengan tujuan untuk mempertemukan dokter dengan pasien.
Software ini dibangun untuk memenuhi Proyek Rekayasa Perangkat Lunak

## Tujuan

Tujuan dari perangkat lunak ini adalah untuk membuat sebuah sistem yang menghubungkan pihak dokter dan pasien dalam membuat jadwal pemeriksaan. Terdapat 3 user yang menggunakan sistem ini, yaitu dokter, pasien, dan admin. Pasien dapat memilih dokter pemeriksaan yang diinginkan dan memilih waktu dan tanggal pemeriksaan. Selanjutnya, dokter dapat menyetujui permintaan pemeriksaan tersebut atau tidak.
Dokter baru yang akan mendaftarkan diri di sistem perlu mengisi profil dokter terlebih dahulu dan diverifikasi oleh admin sebelum dapat menggunakan fungsi sistem untuk dokter.

## Spesifikasi

Software ini dikembangkan menggunakan Javascript dengan framework React untuk mengembangkan Frontend dan menggunakan Node js untuk Backend serta menggunakan layanan MongoDB untuk mengelola database.

## Anggota Kelompok:

Muhammad Arsya Putra<br/>
Adam Yogisyah Putra<br/>
Ahmad Ali Masykur<br/>

## Installasi

<$/doctor-appointment> npm install<br/>
<$/doctor-appointment/client> npm install <br/>

buat file .env untuk SECRET KEY JWT dengan variable name JWT_SECRET
dan buat variable MONGODB_URL untuk connect ke database mongodb
