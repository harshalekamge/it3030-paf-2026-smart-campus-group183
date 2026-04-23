package lk.sliit.smartcampus;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI smartCampusOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smart Campus API")
                        .description("Interactive API documentation for Smart Campus backend endpoints.")
                        .version("v1")
                        .contact(new Contact()
                                .name("Smart Campus Team"))
                        .license(new License()
                                .name("Internal Project Use")));
    }
}
