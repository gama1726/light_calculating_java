package com.electrical.calculation.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.static-dir:../frontend/dist}")
    private String staticDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path base = Paths.get(staticDir).toAbsolutePath().normalize();
        if (Files.exists(base)) {
            Path assetsDir = base.resolve("assets");
            if (Files.exists(assetsDir)) {
                registry.addResourceHandler("/assets/**")
                    .addResourceLocations("file:" + assetsDir.toString() + "/");
            }
        }
    }
}
