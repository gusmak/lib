import GeoFencing, { GeoFencingValue, IConfig } from 'AWING/GeoFencing';
import { notNullValid } from 'AWING/ultis';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface GeoFencingDefinition extends BaseFieldDefinition<GeoFencingValue> {
    type: FIELD_TYPE.GEO_FENCING;
    initValue?: GeoFencingValue | undefined;
    lable: string;
    configs: IConfig;
    value?: GeoFencingValue;
    limit?: { min?: number; max?: number };
    isOnlyMap?: boolean;
}

export function GeoFencingInput(fieldDefinition: GeoFencingDefinition) {
    const { value, onChange, initValue, configs, limit, isOnlyMap, label, onValidateCustom } = fieldDefinition;
    const onValidate = (value: GeoFencingValue | undefined): boolean => {
        if (onValidateCustom) {
            return onValidateCustom(value);
        }
        return notNullValid(value);
    };

    return (
        <div style={{ marginTop: '16px' }}>
            <GeoFencing
                configs={configs}
                label={label ?? 'GeoFencing'}
                initValue={initValue}
                value={value}
                limit={limit}
                isOnlyMap={isOnlyMap}
                onChangeValue={(newValue) => onChange && onChange(newValue, onValidate(newValue))}
            />
        </div>
    );
}

export default GeoFencingInput;
