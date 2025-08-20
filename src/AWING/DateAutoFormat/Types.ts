import { BaseFieldDefinition } from 'AWING/DataInput/interfaces';

export interface DateAutoFormatProps {
    fieldDef: BaseFieldDefinition<Date>;
    fieldValue?: Date;
    onChange?: (date?: Date) => void;
    error?: boolean;
}
