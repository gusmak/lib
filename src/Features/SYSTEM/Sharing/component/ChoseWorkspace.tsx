import { useMemo } from 'react';
import { map, find, cloneDeep, isFunction } from 'lodash';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Workspace } from 'Features/SYSTEM/types';

export type OwnProps = {
    selectedId?: number | number[] | string;
    options: Workspace[];
    disabled?: boolean;
    onChange?: (optionId: number) => void;
};

export default function ComboBox(props: OwnProps) {
    const { disabled, selectedId, onChange } = props;

    const options = useMemo(() => {
        return map(props.options, (option) => ({
            value: option.id,
            text: option.name,
        }));
    }, [props.options]);

    const selected = useMemo(() => {
        const item = find(options, (o) => `${o.value}` === `${selectedId}`);

        return item;
    }, [options, selectedId]);

    const handleChangeWorkspace = (
        option: any
        // | { value: number; text?: string }
        // | { value: number; text?: string }[]
        // | null
    ) => {
        const crOption = cloneDeep(option) as {
            value: number;
            text: string;
        };
        const newValue = crOption ? crOption.value : -1;
        isFunction(onChange) && onChange(newValue as number);
    };

    return (
        <Autocomplete
            id="chose-workspace-field"
            disablePortal
            options={options}
            sx={{ width: '50%' }}
            renderInput={(params) => <TextField {...params} label="Workspace *" variant="standard" />}
            value={selected}
            disabled={disabled}
            getOptionLabel={(option) => option?.text ?? ''}
            onChange={(_e, value) => handleChangeWorkspace(value)}
        />
    );
}
