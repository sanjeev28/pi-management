import * as StellarSdk from '@stellar/stellar-sdk';
import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';
import type { User } from '../types';

/**
 * Generate Stellar keypair from mnemonic phrase
 */
export function generateKeypairFromMnemonic(mnemonic: string): User {
  // Validate mnemonic
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  // Generate seed from mnemonic
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  
  // Use first 32 bytes as secret key
  const secretKey = seed.subarray(0, 32);
  
  // Create Stellar keypair
  const keypair = StellarSdk.Keypair.fromRawEd25519Seed(secretKey);
  
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret()
  };
}

/**
 * Validate mnemonic phrase
 */
export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

/**
 * Encrypt data using AES encryption
 */
export function encryptData(data: string, password: string): string {
  return CryptoJS.AES.encrypt(data, password).toString();
}

/**
 * Decrypt data using AES decryption
 */
export function decryptData(encryptedData: string, password: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, password);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Generate a random encryption key
 */
export function generateEncryptionKey(): string {
  return CryptoJS.lib.WordArray.random(256/8).toString();
}

/**
 * Validate Stellar address format
 */
export function isValidStellarAddress(address: string): boolean {
  try {
    StellarSdk.StrKey.decodeEd25519PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate Pi Network address (starts with G and is valid Stellar address)
 */
export function isValidPiAddress(address: string): boolean {
  return address.startsWith('G') && isValidStellarAddress(address);
}

/**
 * Hash password for secure storage
 */
export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

/**
 * Generate deterministic encryption key from user data
 */
export function generateUserEncryptionKey(publicKey: string, additionalEntropy?: string): string {
  const data = publicKey + (additionalEntropy || '');
  return CryptoJS.SHA256(data).toString();
}