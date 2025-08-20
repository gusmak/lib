import 'react-i18next';
import translations from './resources/en/translation.json';

// Kiểm tra cấu trúc JSON
type ValidateTranslationStructure<T> = {
    [K in keyof T]: T[K] extends Record<string, any> ? ValidateTranslationStructure<T[K]> : string;
};

// Tạo type từ JSON và validate cấu trúc
type Translation = ValidateTranslationStructure<typeof translations>;

// Tạo union type cho tất cả các key có thể có
type RecursiveKeyOf<TObj extends Record<string, any>> = {
    [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any> ? `${TKey}.${RecursiveKeyOf<TObj[TKey]>}` : TKey;
}[keyof TObj & string];

type TranslationKeys = RecursiveKeyOf<Translation>;

declare module 'react-i18next' {
    interface CustomTypeOptions {
        defaultNS: 'common';
        resources: TranslationKeys;
    }
}
