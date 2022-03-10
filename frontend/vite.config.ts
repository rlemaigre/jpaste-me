import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 8080,
        proxy: {
            "/graphql": {
                changeOrigin: true,
                ws: true,
                target: "http://localhost:8088"
            },
            "/graphiql": {
                changeOrigin: true,
                ws: true,
                target: "http://localhost:8088"
            },
        }
    },
    plugins: [vue()]
})
