import { AutocompleteChangeDetails } from '@mui/material';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { USE_LOGIC_OPERATOR, DEFAULT_LOGIC_OPERATOR } from 'Commons/Constant';
import MultipleChoiceComponent from './component';
import { IMultipleChoiceProps, IOption } from './interface';

export const MultipleChoice = (props: IMultipleChoiceProps) => {
    const {
        label = '',
        placeholder = '',
        options = [],
        onChange,
        value,
        defaultValue = [],
        variant = 'outlined',
        error = false,
        helperText = '',
        endAdornmentOptions,
        endAdornmentValue,
        onEndAdornmentValueChange,
    } = props;

    const operators = endAdornmentOptions === USE_LOGIC_OPERATOR ? DEFAULT_LOGIC_OPERATOR : endAdornmentOptions;
    const [popupOpen, setPopupOpen] = useState(false);
    const [relativeOperator, setRelativeOperator] = useState(operators?.[0]?.id);
    const [selected, setSelected] = useState<IOption[]>(value || defaultValue);

    useEffect(() => {
        if (value && !isEqual(value, selected)) {
            setSelected(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (_event: React.SyntheticEvent, value: IOption[], reason: string, details?: AutocompleteChangeDetails<IOption>) => {
        if (reason === 'removeOption') {
            const newSelected = selected.filter((item: IOption) => item.id !== details?.option.id);
            setSelected(newSelected);
            onChange(newSelected);
        } else if (reason === 'clear') {
            setSelected([]);
            onChange([]);
        } else {
            if (Array.isArray(value) && value.length > 0) {
                setSelected(value);
                onChange(value);
            } else {
                onChange([]);
                setSelected([]);
            }
        }
    };

    const handleOpen = (_e: React.SyntheticEvent) => {
        setPopupOpen(true);
    };

    const handleClose = (_e: React.SyntheticEvent, reason: string) => {
        if (reason === 'blur' || reason === 'toggleInput') {
            setPopupOpen(false);
        }
    };

    const handleOperatorChange = (newOperator: string) => {
        setRelativeOperator(newOperator);
        onEndAdornmentValueChange && onEndAdornmentValueChange(newOperator);
    };

    return (
        <MultipleChoiceComponent
            label={label}
            placeholder={placeholder}
            selected={value || selected}
            options={options}
            onChange={handleChange}
            popupOpen={popupOpen}
            onOpen={handleOpen}
            onClose={handleClose}
            variant={variant}
            error={error}
            helperText={helperText}
            onOperatorChange={handleOperatorChange}
            operators={operators}
            operator={endAdornmentValue || relativeOperator}
        />
    );
};

export default MultipleChoice;
