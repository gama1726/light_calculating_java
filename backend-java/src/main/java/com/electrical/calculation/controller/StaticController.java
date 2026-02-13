package com.electrical.calculation.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class StaticController {

    @Value("${app.static-dir:../frontend/dist}")
    private String staticDir;

    @GetMapping("/")
    public ResponseEntity<?> index() {
        Path base = Paths.get(staticDir).toAbsolutePath().normalize();
        Path indexHtml = base.resolve("index.html");
        if (Files.exists(indexHtml)) {
            Resource res = new FileSystemResource(indexHtml);
            return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(res);
        }
        return ResponseEntity.ok()
            .body(java.util.Map.of(
                "message", "API для расчёта электроснабжения производственного цеха",
                "version", "1.0.0",
                "note", "Frontend не собран. Запустите 'npm run build' в папке frontend"));
    }

    @GetMapping("/{path:.+}")
    public ResponseEntity<Resource> spa(@PathVariable String path) {
        if (path.startsWith("api") || path.startsWith("docs") || path.equals("openapi.json")) {
            return ResponseEntity.notFound().build();
        }
        Path base = Paths.get(staticDir).toAbsolutePath().normalize();
        Path file = base.resolve(path).normalize();
        if (Files.exists(file) && Files.isRegularFile(file) && file.startsWith(base)) {
            Resource res = new FileSystemResource(file);
            String contentType = getContentType(path);
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(res);
        }
        Path indexHtml = base.resolve("index.html");
        if (Files.exists(indexHtml)) {
            Resource res = new FileSystemResource(indexHtml);
            return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(res);
        }
        return ResponseEntity.notFound().build();
    }

    private String getContentType(String path) {
        if (path.endsWith(".js")) return "application/javascript";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".ico")) return "image/x-icon";
        if (path.endsWith(".svg")) return "image/svg+xml";
        return "application/octet-stream";
    }
}
