package com.meditrack.dto;

import com.meditrack.entity.User;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private User.Role role;
    private String organizationName;
    private String licenseNumber;
    private String address;
    private Boolean active;
    private Boolean emailVerified;
    private String legalDocumentUrl;
    private User.VerificationStatus verificationStatus;

    public static UserDto fromEntity(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole());
        dto.setOrganizationName(user.getOrganizationName());
        dto.setLicenseNumber(user.getLicenseNumber());
        dto.setAddress(user.getAddress());
        dto.setActive(user.getActive());
        dto.setEmailVerified(user.getEmailVerified());
        dto.setLegalDocumentUrl(user.getLegalDocumentUrl());
        dto.setVerificationStatus(user.getVerificationStatus());
        return dto;
    }
}

