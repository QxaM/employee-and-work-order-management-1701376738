package org.maxq.authorization.controller.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI customOpenAPI() {
    final String basicAuthSchemeName = "Basic Authorization (for login request)";
    final String jwtAuthSchemeName = "JWT Authorization (for protected resources)";

    return new OpenAPI()
        .info(new Info()
            .title("Authorization Service")
            .version("1.0")
            .description("Authorization related APIs service for MaxQ Work Manager"))
        .addSecurityItem(new SecurityRequirement().addList(basicAuthSchemeName))
        .addSecurityItem(new SecurityRequirement().addList(jwtAuthSchemeName))
        .components(new Components()
            .addSecuritySchemes(basicAuthSchemeName, new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("basic"))
            .addSecuritySchemes(jwtAuthSchemeName, new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")));
  }

}
