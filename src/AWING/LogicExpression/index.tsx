import React from 'react';
import { useTranslation } from 'react-i18next';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';
import { ObjectStructure, FunctionStructure } from './types';
import { getSuggestionsAndValidaton } from './utils';

export type LogicExpressionInputProps = Omit<TextFieldProps, 'value' | 'onChange'> & {
    objectStructures: ObjectStructure[];
    functionStructures: FunctionStructure[];
    value: string;
    onChange?: (expresstion: string | undefined, isValid: boolean) => void;
};

function LogicExpressionInput(props: LogicExpressionInputProps) {
    const { t } = useTranslation();

    const { objectStructures, functionStructures, value, onChange, ...rest } = props;

    const [inputValue, setInputValue] = React.useState(value);
    const [suggestions, setSuggestions] = React.useState<string[]>([]);
    const [isValid, setIsValid] = React.useState<boolean>(true);
    const [errorCode, setErrorCode] = React.useState<string>('');

    const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
        setInputValue(newInputValue);
        let x = getSuggestionsAndValidaton(newInputValue, objectStructures, functionStructures);
        setIsValid(x.isValid);
        setSuggestions(x.suggestions.map((x) => newInputValue + x));
        setErrorCode(x.errorCode);
        onChange?.(newInputValue, x.isValid);
    };

    return (
        <Autocomplete
            id="free-solo-demo"
            freeSolo
            fullWidth
            inputValue={inputValue}
            onInputChange={handleInputChange}
            options={suggestions}
            renderInput={(params) => (
                <TextField
                    {...params}
                    error={!isValid}
                    helperText={isValid ? '' : t(`LogicExpression.${errorCode}`)}
                    variant="outlined"
                    {...rest}
                />
            )}
        />
    );
}

export default LogicExpressionInput;
export type { ObjectStructure, FunctionStructure };
