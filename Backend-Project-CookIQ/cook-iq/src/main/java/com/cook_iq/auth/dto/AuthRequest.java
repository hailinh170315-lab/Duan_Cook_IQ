package com.cook_iq.auth.dto;

public record AuthRequest(String email, String password, String fullName) {

}

//public class AuthRequest {
//
//    private String fullName;
//    private String email;
//    private String password;
//
//    public AuthRequest() {
//    }
//
//    public AuthRequest(String fullName, String email, String password) {
//        this.fullName = fullName;
//        this.email = email;
//        this.password = password;
//    }
//
//    public String getFullName() {
//        return fullName;
//    }
//
//    public void setFullName(String fullName) {
//        this.fullName = fullName;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//}
