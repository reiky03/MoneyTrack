import { describe, expect, it } from 'bun:test';
import {
  formatRupiah,
  formatNumberWithDots,
  parseCurrencyInput,
  formatCompactRupiah,
} from '../formatters';

describe('formatters', () => {
  it('formats rupiah correctly for positive numbers', () => {
    expect(formatRupiah(50000)).toBe('Rp 50.000');
    expect(formatRupiah(1500000)).toBe('Rp 1.500.000');
    expect(formatRupiah(0)).toBe('Rp 0');
  });

  it('formats rupiah correctly for negative numbers', () => {
    expect(formatRupiah(-25000)).toBe('-Rp 25.000');
  });

  it('masks rupiah when privacy mode is enabled', () => {
    expect(formatRupiah(1500000, true)).toBe('Rp ••••••');
    expect(formatRupiah(0, true)).toBe('Rp ••••••');
  });

  it('formats number with dots', () => {
    expect(formatNumberWithDots(100000)).toBe('100.000');
    expect(formatNumberWithDots(500)).toBe('500');
  });

  it('parses currency input with formatting', () => {
    expect(parseCurrencyInput('50.000')).toBe(50000);
    expect(parseCurrencyInput('Rp 1.250.000')).toBe(1250000);
    expect(parseCurrencyInput('')).toBe(0);
    expect(parseCurrencyInput('abc')).toBe(0);
  });

  it('formats compact rupiah', () => {
    expect(formatCompactRupiah(1500000)).toBe('1.5 Jt');
    expect(formatCompactRupiah(2500000000)).toBe('2.5 M');
    expect(formatCompactRupiah(25000)).toBe('25 Rb');
    expect(formatCompactRupiah(500)).toBe('500');
  });
});
