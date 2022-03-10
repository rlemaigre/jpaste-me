package jpaste.me.api

import com.netflix.graphql.dgs.webmvc.autoconfigure.DgsWebMvcConfigurationProperties
import com.netflix.graphql.dgs.webmvc.autoconfigure.GraphiQLConfigurer.Constants.PATH_TO_GRAPHIQL_INDEX_HTML
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.Resource
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.resource.PathResourceResolver
import org.springframework.web.servlet.resource.ResourceTransformer
import org.springframework.web.servlet.resource.ResourceTransformerChain
import org.springframework.web.servlet.resource.TransformedResource
import java.io.BufferedReader
import java.io.IOException
import java.nio.charset.StandardCharsets.UTF_8
import javax.servlet.ServletContext
import javax.servlet.http.HttpServletRequest

@Configuration
@EnableConfigurationProperties(DgsWebMvcConfigurationProperties::class)
@Suppress("SpringJavaInjectionPointsAutowiringInspection")
open class GraphiQLConfigurer(
    private val configProps: DgsWebMvcConfigurationProperties,
    private val servletContext: ServletContext
) : WebMvcConfigurer {

    override fun addViewControllers(registry: ViewControllerRegistry) {
        registry.addViewController(configProps.graphiql.path).setViewName("forward:$PATH_TO_GRAPHIQL_INDEX_HTML")
        registry.addViewController("${configProps.graphiql.path}/").setViewName("forward:$PATH_TO_GRAPHIQL_INDEX_HTML")
    }

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry
            .addResourceHandler("/graphiql/**")
            .addResourceLocations("classpath:/static/graphiql/")
            .setCachePeriod(3600)
            .resourceChain(true)
            .addResolver(PathResourceResolver())
            .addTransformer(TokenReplacingTransformer("<DGS_GRAPHQL_PATH>", configProps.path))
    }

    class TokenReplacingTransformer(private val replaceToken: String, private val replaceValue: String) :
        ResourceTransformer {
        @Throws(IOException::class)

        override fun transform(
            request: HttpServletRequest,
            resource: Resource,
            transformerChain: ResourceTransformerChain
        ): Resource {
            if (request.requestURI?.endsWith(PATH_TO_GRAPHIQL_INDEX_HTML) == true) {
                val content = resource.inputStream.bufferedReader().use(BufferedReader::readText)
                return TransformedResource(
                    resource,
                    content.replace(replaceToken, request.contextPath + replaceValue).toByteArray(UTF_8)
                )
            }
            return resource
        }
    }

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(GraphiQLConfigurer::class.java)
    }

    object Constants {
        const val PATH_TO_GRAPHIQL_INDEX_HTML = "/graphiql/index.html"
    }
}