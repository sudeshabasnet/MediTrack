package com.meditrack.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationCodeService {
    
    private static class CodeData {
        String code;
        LocalDateTime expiryTime;
        
        CodeData(String code, LocalDateTime expiryTime) {
            this.code = code;
            this.expiryTime = expiryTime;
        }
    }
    
    // Store verification codes in memory with email as key
    private final Map<String, CodeData> verificationCodes = new ConcurrentHashMap<>();
    
    /**
     * Store a verification code for an email
     * @param email User's email
     * @param code Verification code
     * @param expiryMinutes Minutes until code expires
     */
    public void storeCode(String email, String code, int expiryMinutes) {
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(expiryMinutes);
        verificationCodes.put(email.toLowerCase(), new CodeData(code, expiryTime));
    }
    
    /**
     * Verify a code for an email
     * @param email User's email
     * @param code Code to verify
     * @return true if code is valid and not expired, false otherwise
     */
    public boolean verifyCode(String email, String code) {
        String emailKey = email.toLowerCase();
        CodeData codeData = verificationCodes.get(emailKey);
        
        if (codeData == null) {
            return false; // No code found for this email
        }
        
        // Check if code is expired
        if (LocalDateTime.now().isAfter(codeData.expiryTime)) {
            verificationCodes.remove(emailKey); // Remove expired code
            return false;
        }
        
        // Check if code matches
        if (codeData.code.equals(code)) {
            verificationCodes.remove(emailKey); // Remove used code
            return true;
        }
        
        return false;
    }
    
    /**
     * Remove a verification code for an email
     * @param email User's email
     */
    public void removeCode(String email) {
        verificationCodes.remove(email.toLowerCase());
    }
    
    /**
     * Clean up expired codes (can be called periodically)
     */
    public void cleanupExpiredCodes() {
        LocalDateTime now = LocalDateTime.now();
        verificationCodes.entrySet().removeIf(entry -> 
            now.isAfter(entry.getValue().expiryTime)
        );
    }
}










