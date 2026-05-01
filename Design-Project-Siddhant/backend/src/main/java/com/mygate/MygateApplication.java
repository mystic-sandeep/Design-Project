    package com.mygate;

    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;

    @SpringBootApplication
    public class MygateApplication {
        public static void main(String[] args) {
            SpringApplication.run(MygateApplication.class, args);
            System.out.println("\n🚀 Mygate Backend Started!");
            System.out.println("📱 API: http://localhost:8080");
            System.out.println("📊 H2 Console: http://localhost:8080/h2-console");
            System.out.println("🔗 Swagger: http://localhost:8080/swagger-ui.html\n");
        }
    }