import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// Mengubah scrypt menjadi versi yang mendukung Promise
const scryptAsync = promisify(scrypt);

/**
 * Kelas Password
 *
 * Kelas ini menyediakan metode untuk meng-hash password dan membandingkannya
 * dengan password yang disimpan di database.
 */
export class Password {
  
  /**
   * Fungsi toHash
   *
   * Fungsi ini menerima password pengguna sebagai parameter dan 
   * menghasilkan hash dengan menambahkan salt secara acak. 
   * Hash yang dihasilkan akan berbentuk seperti ini: "hashedPassword.salt"
   *
   * param {string} password - Password yang akan di-hash.
   * returns {Promise<string>} Hash password yang digabungkan dengan salt.
   */
  static async toHash(password: string) {
    // Membuat salt acak dengan panjang 8 byte dan mengonversinya menjadi string heksadesimal
    const salt = randomBytes(8).toString('hex');
    
    // Menghasilkan hash password menggunakan algoritma scrypt
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    // Menggabungkan hash password dan salt, dipisahkan oleh tanda titik
    return `${buf.toString('hex')}.${salt}`;
  }

  /**
   * Fungsi compare
   *
   * Fungsi ini membandingkan password yang disimpan di database dengan 
   * password yang dimasukkan oleh pengguna, setelah di-hash dengan salt yang sama.
   *
   * param {string} storedPassword - Password yang sudah di-hash dan disimpan di database (format: "hashedPassword.salt").
   * param {string} suppliedPassword - Password yang dimasukkan oleh pengguna.
   * returns {Promise<boolean>} True jika password cocok, false jika tidak cocok.
   */
  static async compare(storedPassword: string, suppliedPassword: string) {
    // Memisahkan hash dan salt dari storedPassword
    const [hashedPassword, salt] = storedPassword.split('.');
    
    // Meng-hash password yang dimasukkan pengguna menggunakan salt yang sama
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    // Membandingkan hasil hash dari password yang dimasukkan dengan hash yang disimpan
    return buf.toString('hex') === hashedPassword;
  }
}
