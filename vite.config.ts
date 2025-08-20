import { defineConfig } from 'vite';
import tsconfigpaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react'
import federation from "@originjs/vite-plugin-federation";
import pkg from './package.json';
const { peerDependencies } = pkg as { peerDependencies: { [key: string]: string } };
export default defineConfig({
    optimizeDeps: {
        entries: ['lodash', 'i18next', 'react-i18next', '@mui/material', '@mui/icons-material', 'jotai', 'react', 'react-router']
    },
    preview: {
        port: 3002,
        strictPort: true,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      },
    plugins: [react(), tsconfigpaths(), federation({
        name: "AWING-SYSTEM",
        filename: "awingSystem.js",
        exposes: {
            "./Sharing": "./src/Features/SYSTEM/Sharing/index.tsx",
        },
        shared: Object.assign({}, ...Object.keys(peerDependencies).map((key) => ({ [key]: { import: true }}))),
    }),],
    build: {
        outDir: './build',
        target: 'esnext',
        rollupOptions: {
            output: {
                chunkFileNames: `assets/[hash].js`,
                assetFileNames: `assets/[hash].[ext]`
            }
        }
    },
    esbuild: {
        legalComments: 'none',
    }
});
