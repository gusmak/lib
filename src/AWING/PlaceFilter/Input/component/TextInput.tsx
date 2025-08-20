import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { EnumFieldInputType } from 'AWING/PlaceFilter/Enum';
import { IInputProps } from 'AWING/PlaceFilter/interface';
const noop = () => {};
type IProps = IInputProps<EnumFieldInputType.TEXT>;
function Component(props: IProps) {
    const { filterField, onChange } = props;
    const [searchString, setSearchString] = useState('');
    useEffect(() => {
        [noop, setSearchString][+(searchString !== filterField.value)](filterField.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterField.value]);
    return (
        <TextField
            variant="outlined"
            label={filterField.label}
            placeholder={filterField.placeHolders?.[0]}
            value={searchString}
            slotProps={{
                input: {
                    startAdornment: filterField.style.icon,
                },
                htmlInput: {
                    style: {
                        paddingLeft: '8.5px',
                    },
                },
            }}
            fullWidth
            size="small"
            onChange={(e) => {
                setSearchString(e.target.value);
            }}
            onKeyDown={(e) => {
                [noop, onChange][+(e.key === 'Enter')](searchString?.trim(), 0);
            }}
        />
    );
}
export const renderTextInput: React.FC<IProps> = ({ filterField, index, onChange }) => {
    return (
        <Component
            filterField={filterField}
            onChange={(newValue) => {
                onChange(newValue, index);
            }}
            index={0}
        />
    );
};
