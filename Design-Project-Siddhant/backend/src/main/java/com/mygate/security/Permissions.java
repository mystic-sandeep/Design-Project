package com.mygate.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to specify required permissions for an endpoint
 * Usage: @Permissions("approveVisitor") or @Permissions({"approveVisitor", "registerVisitor"})
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Permissions {
    String[] value() default {};
}