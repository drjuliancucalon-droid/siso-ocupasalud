// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Formateadores
// Extraído de src/App.jsx (FASE 4 — ETAPA A)
// Funciones: numeroALetras (L8462), getSpanishDate (L8578)
// ═══════════════════════════════════════════════════════════════

import { MONTHS_ES } from './constants.js';

/**
 * Convierte un número a letras (formato colombiano).
 * @param {number} num - Número a convertir
 * @returns {string} Número en letras
 */
export const numeroALetras = (num) => {
  if (!num && num !== 0) return '';
  const n = Number(num);
  if (isNaN(n)) return '';
  
  const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const especiales = ['ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  const convertir = (n) => {
    if (n === 0) return 'CERO';
    if (n === 100) return 'CIEN';
    
    let letras = '';
    
    // Millones
    if (n >= 1000000) {
      const millones = Math.floor(n / 1000000);
      if (millones === 1) letras += 'UN MILLON ';
      else letras += convertir(millones) + ' MILLONES ';
      n %= 1000000;
    }
    
    // Miles
    if (n >= 1000) {
      const miles = Math.floor(n / 1000);
      if (miles === 1) letras += 'MIL ';
      else letras += convertir(miles) + ' MIL ';
      n %= 1000;
    }
    
    // Centenas
    if (n >= 100) {
      const c = Math.floor(n / 100);
      letras += centenas[c] + ' ';
      n %= 100;
    }
    
    // Decenas y unidades
    if (n > 0) {
      if (n < 10) {
        letras += unidades[n];
      } else if (n < 20) {
        letras += especiales[n - 11];
      } else {
        const d = Math.floor(n / 10);
        const u = n % 10;
        if (d === 2 && u === 0) letras += 'VEINTE';
        else if (d === 2) letras += 'VEINTI' + unidades[u].toLowerCase();
        else {
          letras += decenas[d];
          if (u > 0) letras += ' Y ' + unidades[u];
        }
      }
    }
    
    return letras.trim();
  };

  const entero = Math.floor(Math.abs(n));
  const decimal = Math.round((Math.abs(n) - entero) * 100);
  
  let resultado = convertir(entero);
  if (n < 0) resultado = 'MENOS ' + resultado;
  
  if (decimal > 0) {
    resultado += ' CON ' + decimal.toString().padStart(2, '0') + '/100';
  }
  
  return resultado;
};

/**
 * Obtiene fecha en formato español.
 * @param {string|Date} d - Fecha en ISO string o Date
 * @returns {string} Fecha en formato "1 de enero de 2024"
 */
export const getSpanishDate = (d) => {
  if (!d) return 'Fecha no disponible';
  const date = typeof d === 'string' ? new Date(d + (d.includes('T') ? '' : 'T00:00:00')) : d;
  if (isNaN(date.getTime())) return 'Fecha invalida';
  const day = date.getDate();
  const month = MONTHS_ES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
};

/**
 * Formatea fecha a DD/MM/YYYY.
 * @param {string} f - Fecha ISO (YYYY-MM-DD)
 * @returns {string} Fecha formateada
 */
export const formatFechaCorta = (f) => {
  if (!f) return '';
  const [y, m, d] = f.split('-');
  if (!y || !m || !d) return f;
  return `${d}/${m}/${y}`;
};

/**
 * Formatea fecha a YYYY-MM-DD.
 * @param {Date|string} date
 * @returns {string} Fecha ISO
 */
export const formatISO = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!d || isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
};

/**
 * Formatea un número con separadores de miles.
 * @param {number} n
 * @returns {string}
 */
export const formatNumero = (n) => {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString('es-CO');
};

/**
 * Formatea un valor monetario en COP.
 * @param {number} n
 * @returns {string}
 */
export const formatMoneda = (n) => {
  if (n === null || n === undefined) return '$0';
  return '$' + Number(n).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

/**
 * Limpia un string: solo dígitos.
 * @param {string} s
 * @returns {string}
 */
export const soloDigitos = (s) => {
  if (!s) return '';
  return String(s).replace(/[^0-9]/g, '');
};