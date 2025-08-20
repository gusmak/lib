import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist', 'vite.config.ts', 'public'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        ignores: ['dist', 'public', 'src/setupTests.ts', 'src/global.d.ts', '**/*.test.*', '**/stories/**'],
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'ts-nocheck/no-ts-nocheck': 'warn',
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: 'react',
                            importNames: ['default'],
                            message: 'Please import specific hooks or components from React instead of importing the whole module.',
                        },
                    ],
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error', // Cảnh báo hoặc báo lỗi
                {
                    varsIgnorePattern: '^_', // Bỏ qua các biến bắt đầu bằng dấu gạch dưới
                    argsIgnorePattern: '^_', // Bỏ qua các tham số bắt đầu bằng dấu gạch dưới
                },
            ],
        },
    }
);
