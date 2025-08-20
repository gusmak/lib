import GeoFencing from 'AWING/GeoFencing';
import { EnumFieldInputType } from 'AWING/PlaceFilter/Enum';
import { IInputProps } from 'AWING/PlaceFilter/interface';
import { FC, createElement as _c } from 'react';

export const renderGeoFencing: FC<IInputProps<EnumFieldInputType.GEO_FENCING>> = ({ filterField, index, onChange }) => {
    return _c(GeoFencing, {
        initValue: filterField.value,
        onChangeValue(value) {
            onChange(value, index);
        },
        label: filterField.label,
        configs: {
            GOOGLE_MAP_KEY: filterField?.GOOGLE_MAP_KEY || '',
        },
        value: filterField.value,
        limit: filterField?.radiusLimit,
    });
};
