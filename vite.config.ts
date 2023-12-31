import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import zipPack from 'vite-plugin-zip-pack'
//@ts-ignore
import manifest from './src/manifest'
//@ts-ignore
import { config } from './src/read_pages_folder'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        build: {
            emptyOutDir: true,
            outDir: 'build',
            rollupOptions: {
                input: config,
                output: {
                    chunkFileNames: 'assets/chunk-[hash].js',
                },
            },
        },

        plugins: [
            crx({ manifest }),
            react(),
            zipPack({
                outDir: `package`,
                inDir: 'build',
                // @ts-ignore
                outFileName: `${
                    // @ts-ignore
                    manifest.short_name ?? manifest.name.replaceAll(' ', '-')

                    // @ts-ignore
                }-extension-v${manifest.version}.zip`,
            }),
        ],
        resolve: {
            alias: {
                config: '/config',
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    includePaths: ['node_modules'],
                },
            },
        },
    }
})
