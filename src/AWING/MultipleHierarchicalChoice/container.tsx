import { AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteCloseReason, AutocompleteValue } from '@mui/material';
import { useState } from 'react';
import { USE_LOGIC_OPERATOR, DEFAULT_LOGIC_OPERATOR } from 'Commons/Constant';
import MultipleHierarchicalChoiceComponent from './component';
import { IMultipleHierarchicalChoiceInput, IMultipleHierarchicalChoiceProps } from './interface';

const MultipleHierarchicalChoice = (props: IMultipleHierarchicalChoiceProps) => {
    const {
        defaultValue = [],
        label = '',
        placeholder = '',
        options,
        onChange,
        variant = 'outlined',
        error,
        helperText,
        parentTitle,
        value,
        minLevel = 1,
        endAdornmentOptions,
        endAdornmentValue,
        onEndAdornmentValueChange,
        maxSelected,
        disabled,
    } = props;

    const operators = endAdornmentOptions === USE_LOGIC_OPERATOR ? DEFAULT_LOGIC_OPERATOR : endAdornmentOptions;
    const [currentOptions, setCurrentOptions] = useState<IMultipleHierarchicalChoiceInput[]>(
        options?.filter((item) => item.parentUnitCode === '') || []
    );

    const [selected, setSelected] = useState<IMultipleHierarchicalChoiceInput[][]>(value || defaultValue);

    const [currentChoice, setCurrentChoice] = useState<IMultipleHierarchicalChoiceInput[]>([]);

    const [popupOpen, setPopupOpen] = useState(false);
    const [relativeOperator, setRelativeOperator] = useState(operators?.[0]?.id);

    const getOptionsDefault = () => {
        const optionParents = options?.filter((item) => item.parentUnitCode === '') || [];
        setCurrentOptions(optionParents);
    };
    const checkExist = (array: IMultipleHierarchicalChoiceInput[][], value: IMultipleHierarchicalChoiceInput) => {
        return !!array.find((a) => {
            const lastItem = a[a.length - 1];
            return lastItem.code === value.code;
        });
    };
    const checkMerged = (array: IMultipleHierarchicalChoiceInput[][], value: IMultipleHierarchicalChoiceInput) => {
        return !!array.find((a) => {
            return !!a.find((item) => item.code === value.code);
        });
    };
    const update = (newValue: IMultipleHierarchicalChoiceInput[][]) => {
        setSelected(newValue);
        onChange(newValue);
    };
    const handleChange = (
        _event: React.SyntheticEvent,
        values: AutocompleteValue<IMultipleHierarchicalChoiceInput, boolean | undefined, boolean | undefined, boolean | undefined>,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<IMultipleHierarchicalChoiceInput>
    ) => {
        if (reason === 'removeOption') {
            const removeCode = details?.option.code;
            const filterSelectedByCode = selected.filter((item) => {
                return !item.find((i) => i.code === removeCode);
            });
            update(filterSelectedByCode);
        } else if (reason === 'clear') {
            update([]);
        } else {
            if (Array.isArray(values) && values.length > 0) {
                const newValue = values.pop();
                const optionByCode =
                    options?.filter((item) => newValue && item.parentUnitCode === (newValue as IMultipleHierarchicalChoiceInput).code) ||
                    [];

                const isExist = checkExist(selected, newValue as IMultipleHierarchicalChoiceInput);

                if (optionByCode.length > 0) {
                    if (isExist) {
                        const newSelected = selected.filter((item) => {
                            return !item.find((i) => newValue && i.code === (newValue as IMultipleHierarchicalChoiceInput).code);
                        });
                        update(newSelected);
                    } else {
                        setCurrentChoice([...currentChoice, newValue as IMultipleHierarchicalChoiceInput]);
                        setCurrentOptions(optionByCode);
                    }
                } else {
                    let newSelected: IMultipleHierarchicalChoiceInput[][];
                    if (isExist) {
                        newSelected = selected.filter((item) => {
                            return !item.find((i) => newValue && i.code === (newValue as IMultipleHierarchicalChoiceInput).code);
                        });
                    } else {
                        newSelected = [...selected, [...currentChoice, newValue as IMultipleHierarchicalChoiceInput]];
                    }
                    setCurrentChoice([]);
                    setPopupOpen(false);
                    getOptionsDefault();
                    update(newSelected);
                }
            }
        }
    };

    const handlePopupOpen = (_e: React.SyntheticEvent) => {
        if (!maxSelected || (maxSelected && selected.length < maxSelected)) {
            setPopupOpen(true);
        }
    };

    const handlePopupClose = (_e: React.SyntheticEvent, reason: AutocompleteCloseReason) => {
        if (reason === 'blur' || reason === 'toggleInput') {
            if (minLevel && currentChoice.length >= minLevel) {
                let newSelected = [];
                const currentChoiceLastItem = currentChoice[currentChoice.length - 1];
                if (checkExist(selected, currentChoiceLastItem)) {
                    newSelected = selected.filter((item) => {
                        return !item.find((i) => i.code === currentChoiceLastItem.code);
                    });
                } else {
                    if (checkMerged(selected, currentChoiceLastItem)) {
                        newSelected = selected.filter((item) => {
                            return !item.find((i) => i.code === currentChoiceLastItem.code);
                        });
                        newSelected = [...newSelected, currentChoice];
                    } else {
                        newSelected = [...selected, currentChoice];
                    }
                }
                setSelected(newSelected);
                onChange(newSelected);
            }
            setCurrentChoice([]);
            setPopupOpen(false);
            getOptionsDefault();
        }
    };

    const handleOperatorChange = (newOperator: string) => {
        setRelativeOperator(newOperator);
        onEndAdornmentValueChange && onEndAdornmentValueChange(newOperator);
    };

    return (
        <MultipleHierarchicalChoiceComponent
            currentChoice={currentChoice}
            open={popupOpen}
            placeholder={placeholder}
            label={label}
            variant={variant}
            options={currentOptions}
            selected={value || selected}
            onChange={handleChange}
            onOpen={handlePopupOpen}
            onClose={handlePopupClose}
            error={error}
            helperText={helperText}
            parentTitle={parentTitle}
            onOperatorChange={handleOperatorChange}
            operators={operators}
            operator={endAdornmentValue || relativeOperator}
            disabled={disabled}
        />
    );
};

export default MultipleHierarchicalChoice;
