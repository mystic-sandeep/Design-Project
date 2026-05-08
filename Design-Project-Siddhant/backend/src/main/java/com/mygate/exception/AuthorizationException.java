package com.mygate.exception;

public class AuthorizationException extends RuntimeException {
    
    private String errorCode;
    
    public AuthorizationException(String message) {
        super(message);
        this.errorCode = "AUTHZ_ERROR";
    }
    
    public AuthorizationException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
}