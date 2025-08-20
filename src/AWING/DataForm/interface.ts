import { FieldDefinitionProps } from 'AWING/DataInput/interfaces';
import { ReactNode } from 'react';
// #region T extends object: T là 1 object bất kỳ
export type DataFormProps<T extends object> = {
    caption?: string;
    actions?: ReactNode;
    padding?: 'none' | 'normal';
    fields: FieldDefinitionProps<T>[];
    /**
     * Giá trị mặc định của đối tượng T (dùng để hiển thị và so sánh thông tin có thay đổi không)
     */
    oldValue?: Partial<T>;
    onUpdate?(fieldsToUpdate: Partial<T>, formValid: boolean, key: keyof T): void;
    onValidateForm?(obj: Partial<T>): boolean;
};
