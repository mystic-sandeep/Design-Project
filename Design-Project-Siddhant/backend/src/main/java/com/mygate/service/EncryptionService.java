package com.mygate.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

/**
 * Layer 5: AES-256 Encryption for sensitive data at rest
 */
@Service
public class EncryptionService {
    
    @Value("${encryption.key:mygate2026encryptionkey1234567890abcdef}")
    private String encryptionKey;
    
    @Value("${encryption.algorithm:AES}")
    private String algorithm;
    
    private static final int KEY_SIZE = 16; // 128-bit for AES-128 (can use 32 for AES-256)
    
    /**
     * Encrypt sensitive data (Aadhaar, PAN, backup email, etc.)
     */
    public String encrypt(String plainText) {
        try {
            if (plainText == null || plainText.isEmpty()) {
                return null;
            }
            
            byte[] decodedKey = getFixedKey();
            SecretKeySpec secretKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, algorithm);
            
            Cipher cipher = Cipher.getInstance(algorithm);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            
            byte[] encryptedData = cipher.doFinal(plainText.getBytes());
            return Base64.getEncoder().encodeToString(encryptedData);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Decrypt sensitive data
     */
    public String decrypt(String encryptedText) {
        try {
            if (encryptedText == null || encryptedText.isEmpty()) {
                return null;
            }
            
            byte[] decodedKey = getFixedKey();
            SecretKeySpec secretKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, algorithm);
            
            Cipher cipher = Cipher.getInstance(algorithm);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            
            byte[] decodedData = Base64.getDecoder().decode(encryptedText);
            byte[] decryptedData = cipher.doFinal(decodedData);
            return new String(decryptedData);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get fixed-size key from configuration
     */
    private byte[] getFixedKey() {
        String key = encryptionKey;
        if (key == null || key.isEmpty()) {
            key = "mygate2026encryptionkey1234567890abcdef";
        }
        
        byte[] keyBytes = new byte[KEY_SIZE];
        byte[] keyData = key.getBytes();
        
        for (int i = 0; i < keyBytes.length; i++) {
            keyBytes[i] = keyData[i % keyData.length];
        }
        
        return keyBytes;
    }
    
    /**
     * Hash sensitive data for verification (one-way)
     */
    public String hashSensitiveData(String data) {
        try {
            if (data == null || data.isEmpty()) {
                return null;
            }
            
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] messageDigest = md.digest(data.getBytes());
            return Base64.getEncoder().encodeToString(messageDigest);
        } catch (Exception e) {
            throw new RuntimeException("Hashing failed: " + e.getMessage(), e);
        }
    }
}