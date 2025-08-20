import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import alias from '@rollup/plugin-alias';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';

export default [
    {
        input: 'src/index.tsx',
        output: [
            {
                inlineDynamicImports: true,
                file: 'dist/esm/index.js',
                format: 'esm',
            },
        ],
        plugins: [
            resolve({
                browser: true,
            }),
            json(),
            commonjs(),
            url({
                include: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.gif'],
            }),
            svgr(),
            typescript({
                tsconfig: './tsconfig.json',
                resolveJsonModule: true,
                exclude: [
                    '**/stories/**',
                    '**/*.stories.tsx',
                    '**/*.stories.jsx',
                    '**/*.test.tsx',
                    '**/*.test.ts',
                    '**/*.test.jsx',
                    '**/__test__/**',
                    '**/__tests__/**',
                ],
            }),
            postcss({
                plugins: [postcssImport()],
                modules: true,
                extract: 'styles.css',
                minimize: true,
                inject: false,
                sourceMap: true,
                extensions: ['.scss', '.css'],
                use: ['sass'],
            }),
            babel({
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                exclude: 'node_modules/**',
                babelHelpers: 'bundled',
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            }),
            copy({
                targets: [
                    { src: 'src/Assets', dest: 'dist/esm' },
                    { src: 'src/translate/resources', dest: 'dist/esm/translate' },
                ],
            }),
            alias({
                entries: [
                    { find: 'AWING', replacement: './src/AWING' },
                    { find: 'Features', replacement: './src/Features' },
                    { find: 'Commons', replacement: './src/Commons' },
                    { find: 'Context', replacement: './src/Context' },
                    { find: 'Themes', replacement: './src/Themes' },
                    { find: 'translate', replacement: './src/translate' },
                    { find: 'Utils', replacement: './src/Utils' },
                    { find: 'plugins', replacement: './src/Assets' },
                ],
            }),
        ],
        external: [
            '@emotion/react',
            '@emotion/styled',
            '@mui/icons-material',
            '@mui/lab',
            '@mui/material',
            '@mui/styles',
            '@mui/x-date-pickers',
            '@mui/x-tree-view',
            'i18next',
            'react',
            'react-dom',
            'react-i18next',
            'react-router',
            'jotai',
            'react-helmet-async',
        ],
        onwarn(warning, warn) {
            if (warning.message.includes('"use client"')) {
                return; // Bỏ qua cảnh báo này
            }

            // if (warning.plugin === 'typescript') {
            //     throw new Error(`Build failed due to TypeScript warning: ${warning.message}`);
            // }

            // Gọi hàm mặc định để xử lý các warning còn lại
            warn(warning);
        },
    },
    {
        input: 'dist/esm/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'esm' }],
        plugins: [dts()],
        external: [/\.(sc|c)ss$/],
    },
];
