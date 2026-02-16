import CryptoJS from 'crypto-js';

// WARNING: In production, this key should be managed securely (e.g., via a KMS)
// and not exposed in the client-side code if strict security is required.
// For this MVP, we use an environment variable.
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'dev-secret-key-change-in-prod';

/**
 * Encrypts a string using AES.
 * @param data The string to encrypt.
 * @returns The encrypted string (ciphertext).
 */
export const encrypt = (data: string): string => {
    if (!data) return '';
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

/**
 * Decrypts an AES encrypted string.
 * @param ciphertext The encrypted string to decrypt.
 * @returns The decrypted string (original data).
 */
export const decrypt = (ciphertext: string): string => {
    if (!ciphertext) return '';
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    } catch (error) {
        console.error('Decryption failed:', error);
        return '';
    }
};
