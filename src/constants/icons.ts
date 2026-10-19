import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export interface IconOption {
  name: IconName;
  label: string;
  category: string;
}

export const ICON_CATEGORIES = [
  'Umum & Finansial',
  'Makanan & Belanja',
  'Pendidikan & Karir',
  'Rumah & Transportasi',
  'Gaya Hidup & Hiburan',
  'Kesehatan & Kebugaran',
] as const;

export const AVAILABLE_ICONS: IconOption[] = [
  // Umum & Finansial
  { name: 'wallet', label: 'Dompet', category: 'Umum & Finansial' },
  { name: 'card', label: 'Kartu', category: 'Umum & Finansial' },
  { name: 'cash', label: 'Uang Tunai', category: 'Umum & Finansial' },
  { name: 'trending-up', label: 'Investasi', category: 'Umum & Finansial' },
  { name: 'receipt', label: 'Struk / Tagihan', category: 'Umum & Finansial' },
  { name: 'pricetag', label: 'Promo / Diskon', category: 'Umum & Finansial' },
  { name: 'briefcase', label: 'Gaji / Bisnis', category: 'Umum & Finansial' },
  { name: 'shield-checkmark', label: 'Asuransi', category: 'Umum & Finansial' },

  // Makanan & Belanja
  { name: 'cart', label: 'Belanja', category: 'Makanan & Belanja' },
  { name: 'basket', label: 'Pasar / Supermarket', category: 'Makanan & Belanja' },
  { name: 'bag-handle', label: 'Mall / Belanja', category: 'Makanan & Belanja' },
  { name: 'restaurant', label: 'Resto / Warung', category: 'Makanan & Belanja' },
  { name: 'fast-food', label: 'Camilan / Makanan', category: 'Makanan & Belanja' },
  { name: 'cafe', label: 'Kopi & Tongkrongan', category: 'Makanan & Belanja' },
  { name: 'pizza', label: 'Makan Bareng', category: 'Makanan & Belanja' },
  { name: 'nutrition', label: 'Sayur & Buah', category: 'Makanan & Belanja' },

  // Pendidikan & Karir
  { name: 'school', label: 'Pendidikan / Kuliah', category: 'Pendidikan & Karir' },
  { name: 'book', label: 'Buku & Modul', category: 'Pendidikan & Karir' },
  { name: 'library', label: 'Kursus / Les', category: 'Pendidikan & Karir' },
  { name: 'pencil', label: 'Alat Tulis', category: 'Pendidikan & Karir' },
  { name: 'laptop', label: 'Alat Kerja / Laptop', category: 'Pendidikan & Karir' },
  { name: 'phone-portrait', label: 'Pulsa & Kuota', category: 'Pendidikan & Karir' },

  // Rumah & Transportasi
  { name: 'home', label: 'Rumah & Kos', category: 'Rumah & Transportasi' },
  { name: 'flash', label: 'Listrik & Utilitas', category: 'Rumah & Transportasi' },
  { name: 'water', label: 'Air PDAM', category: 'Rumah & Transportasi' },
  { name: 'wifi', label: 'Internet Rumah', category: 'Rumah & Transportasi' },
  { name: 'car', label: 'Mobil & Bensin', category: 'Rumah & Transportasi' },
  { name: 'bicycle', label: 'Motor & Sepeda', category: 'Rumah & Transportasi' },
  { name: 'bus', label: 'Kendaraan Umum', category: 'Rumah & Transportasi' },
  { name: 'airplane', label: 'Tiket & Perjalanan', category: 'Rumah & Transportasi' },

  // Gaya Hidup & Hiburan
  { name: 'film', label: 'Bioskop & Film', category: 'Gaya Hidup & Hiburan' },
  { name: 'game-controller', label: 'Games & Topup', category: 'Gaya Hidup & Hiburan' },
  { name: 'musical-notes', label: 'Musik & Konser', category: 'Gaya Hidup & Hiburan' },
  { name: 'shirt', label: 'Pakaian & Fashion', category: 'Gaya Hidup & Hiburan' },
  { name: 'sparkles', label: 'Skincare & Perawatan', category: 'Gaya Hidup & Hiburan' },
  { name: 'gift', label: 'Kado & Donasi', category: 'Gaya Hidup & Hiburan' },
  { name: 'paw', label: 'Hewan Peliharaan', category: 'Gaya Hidup & Hiburan' },

  // Kesehatan & Kebugaran
  { name: 'medkit', label: 'Obat & Rumah Sakit', category: 'Kesehatan & Kebugaran' },
  { name: 'heart', label: 'Kesehatan', category: 'Kesehatan & Kebugaran' },
  { name: 'fitness', label: 'Gym & Olahraga', category: 'Kesehatan & Kebugaran' },
  { name: 'bandage', label: 'P3K / Darurat', category: 'Kesehatan & Kebugaran' },
];
