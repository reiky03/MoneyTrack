# MoneyTrack 💳✨

Aplikasi pencatat keuangan modern, minimalis, dan interaktif dengan desain kelas dunia untuk Android dan iOS, dibangun menggunakan **React Native + Expo (TypeScript)**.

---

## 🌟 Fitur Utama (MVP)

1. **Dashboard Saldo Bersih & Multi-Account:**
   - Menampilkan total kekayaan bersih (*Net Worth*) dalam kartu gradien gelap modern.
   - Slider kartu dompet / sumber uang yang fleksibel: **Uang Bank (BCA)**, **Uang Kas (Dompet)**, **E-Wallet (GoPay)**, dan lainnya.
   - Saldo tiap akun diperbarui secara otomatis secara *real-time* berdasarkan riwayat transaksi.
   - Filter transaksi instan hanya dengan mengetuk kartu dompet tertentu.

2. **Ringkasan Arus Kas & Periode Fleksibel:**
   - Kartu Pemasukan (Hijau) vs Pengeluaran (Merah) beserta selisih (*Surplus/Defisit*).
   - Pengatur periode cepat: **Bulan Ini**, **Bulan Lalu**, **Minggu Ini**, **Hari Ini**, **Tahun Ini**.
   - **Pemilih Rentang Tanggal Kustom:** Bebas atur tanggal mulai hingga tanggal selesai dengan pilihan cepat (7 hari, 30 hari, dll.).

3. **Grafik Interaktif Arus Kas:**
   - Grafik batang visual membandingkan pemasukan dan pengeluaran per interval waktu dalam periode terpilih.
   - Skala otomatis dinamis dengan tooltip interaktif (ketuk batang untuk melihat nominal tepatnya).

4. **Analisis Kategori (Breakdown):**
   - Rincian persentase belanja berdasarkan kategori dengan progress bar berwarna khas.
   - Tab beralih antara analisis Pengeluaran dan Pemasukan.

5. **Pencatatan Transaksi Cepat & Lengkap:**
   - Opsi Tipe: **Pengeluaran**, **Pemasukan**, dan **Transfer Antar Akun**.
   - Input nominal besar berformat Rupiah otomatis (`Rp 0`) dengan tombol tambah cepat (`+10rb`, `+25rb`, `+50rb`, `+100rb`, `+500rb`).
   - Pilihan sumber uang asal (sesuai dompet yang dibuat).
   - Pilihan kategori utama: **Pendidikan**, **Belanja**, **Rumah & Tagihan**, **Makanan & Minuman**, **Transportasi**, **Hiburan**, **Kesehatan**, dll.
   - **Pembuat Kategori Baru:** Lengkap dengan katalog 30+ pilihan ikon terkelompok dan palet 12 warna tema modern!
   - Catatan opsional (misal: *"Belanja telur & bumbu dapur"*, *"Kopi Kenangan"*).
   - Pemilih waktu transaksi (Hari ini / Kemarin).

6. **Privasi & Keamanan Data (Offline-First):**
   - Mode sensor privasi (ikon mata 👁️ di header): sekali ketuk, semua angka saldo disamarkan menjadi `Rp ••••••`.
   - Data 100% tersimpan lokal di perangkat menggunakan penyimpanan terenkripsi offline (`AsyncStorage`).

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan dependensi sudah terpasang. Jalankan perintah berikut di terminal:

```bash
# Menjalankan development server
bun start
# atau
npx expo start
```

### Opsi Preview di HP Android:
1. Pasang aplikasi **Expo Go** dari Google Play Store di HP Android kamu.
2. Scan kode **QR** yang muncul di terminal menggunakan Expo Go atau kamera HP.
3. Aplikasi akan langsung terbuka di HP secara *live reload*!

### Opsi Preview di Emulator Android:
```bash
bun run android
# atau
npx expo start --android
```

### Opsi Menjalankan Unit Testing:
```bash
bun test
```

### Opsi Cek Ketepatan Tipe (TypeScript):
```bash
npx tsc --noEmit
```

---

## 📁 Struktur Kode

```
AppMoneyTrack/
├── src/
│   ├── types/               # TypeScript interfaces & types (Wallet, Category, Transaction)
│   ├── constants/           # Palet tema dark fintech, katalog ikon, default data
│   ├── utils/               # Format mata uang rupiah, dateUtils, perhitungan kas & saldo
│   │   └── __tests__/       # Unit tests (calculations, formatters, dateUtils)
│   ├── services/            # StorageService (AsyncStorage persistence & seed data)
│   ├── context/             # MoneyContext (State management & haptic feedback)
│   ├── components/          # Komponen UI modern & modular
│   │   ├── Header.tsx
│   │   ├── TotalBalanceCard.tsx
│   │   ├── WalletSlider.tsx
│   │   ├── PeriodFilterBar.tsx
│   │   ├── CashflowChart.tsx
│   │   ├── CategoryBreakdown.tsx
│   │   ├── TransactionList.tsx
│   │   ├── TransactionItem.tsx
│   │   ├── AddTransactionModal.tsx
│   │   ├── AddWalletModal.tsx
│   │   ├── AddCategoryModal.tsx
│   │   ├── CustomDateRangeModal.tsx
│   │   ├── ManageWalletsModal.tsx
│   │   └── IconPickerModal.tsx
│   └── screens/
│       └── DashboardScreen.tsx
├── App.tsx                  # Root wrapper (SafeAreaProvider, MoneyProvider)
├── app.json                 # Expo config & Android branding
└── package.json
```
