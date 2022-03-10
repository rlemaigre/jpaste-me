package jpaste.me.api

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class StaticResourceConfig : WebMvcConfigurer {
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry.addResourceHandler("/index.html")
            .addResourceLocations("classpath:public/index.html")
            .setCachePeriod(0)
        registry.addResourceHandler("/favicon.ico")
            .addResourceLocations("classpath:public/favicon.ico")
            .setCachePeriod(0)
        registry.addResourceHandler("/assets/**")
            .addResourceLocations("classpath:public/assets/")
            .setCachePeriod(ONE_YEAR_IN_SECONDS)
        super.addResourceHandlers(registry)
    }

    companion object {
        private const val ONE_YEAR_IN_SECONDS = 31536000
    }
}