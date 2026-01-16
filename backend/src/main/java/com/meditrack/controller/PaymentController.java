package com.meditrack.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class PaymentController {

    @Value("${esewa.product.code:EPAYTEST}")
    private String productCode;

    @Value("${esewa.secret:8gBm/:&EnhH.1/q}")
    private String secret;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @PostMapping("/esewa")
    public ResponseEntity<Map<String, Object>> initiateEsewaPayment(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {
        
        Number total = (Number) payload.getOrDefault("total_amount", payload.getOrDefault("amount", 0));
        double totalAmount = total == null ? 0 : total.doubleValue();
        String totalStr = String.format(java.util.Locale.US, "%.2f", totalAmount);
        
        String transactionUuid = String.valueOf(System.currentTimeMillis());
        String signedFields = "total_amount,transaction_uuid,product_code";
        
        // Build message strictly from signed_fields order
        StringBuilder messageBuilder = new StringBuilder();
        String[] parts = signedFields.split(",");
        for (int i = 0; i < parts.length; i++) {
            String key = parts[i].trim();
            String value;
            switch (key) {
                case "total_amount":
                    value = totalStr;
                    break;
                case "transaction_uuid":
                    value = transactionUuid;
                    break;
                case "product_code":
                    value = productCode;
                    break;
                default:
                    value = "";
                    break;
            }
            if (i > 0) messageBuilder.append(',');
            messageBuilder.append(key).append('=').append(value);
        }
        
        String message = messageBuilder.toString();
        String signature = hmacSha256Base64(secret, message);
        
        Map<String, Object> data = new HashMap<>();
        
        data.put("amount", totalStr);
        data.put("tax_amount", "0");
        data.put("total_amount", totalStr);
        data.put("transaction_uuid", transactionUuid);
        data.put("product_code", productCode);
        data.put("product_service_charge", "0");
        data.put("product_delivery_charge", "0");
        data.put("success_url", frontendUrl + "/payment/success");
        data.put("failure_url", frontendUrl + "/payment/failure");
        data.put("signed_field_names", signedFields);
        data.put("signature", signature);
        // Use correct eSewa test environment URL
        data.put("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");
        
        return ResponseEntity.ok(data);
    }

    @GetMapping("/success")
    public ResponseEntity<Map<String, String>> paymentSuccess(
            @RequestParam Map<String, String> params) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Payment successful");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/failure")
    public ResponseEntity<Map<String, String>> paymentFailure(
            @RequestParam Map<String, String> params) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "failure");
        response.put("message", "Payment failed");
        return ResponseEntity.ok(response);
    }

    private static String hmacSha256Base64(String secret, String message) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] signature = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(signature);
        } catch (Exception e) {
            return "";
        }
    }
}

