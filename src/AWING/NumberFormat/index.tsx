import { useContext, type ChangeEvent } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { formatNumberWithLanguage } from '../helper';
import { AwingContext } from '../../Context';

export const NumberFormat = (props: TextFieldProps & { min?: number }) => {
    const { value, onChange, min, ...other } = props;
    const { i18next } = useContext(AwingContext);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const el = event.target;
        let newValue = el.value;
        newValue = getFloatString(newValue);

        if (onChange) {
            event.target.value = newValue;
            onChange(event);
        }
    };

    function escapeRegExp(str: string) {
        return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
    }

    function getFloatString(num: string = '') {
        const decimalSeparator = i18next.language === 'vi' ? ',' : '.';

        //remove negation for regex check
        const hasNegation = num[0] === '-';
        if (hasNegation) num = num.replace('-', '');

        const numRegex = new RegExp('[0-9]|' + escapeRegExp(decimalSeparator), 'g');
        num = (num.match(numRegex) || []).join('').replace(decimalSeparator, '.');

        //remove extra decimals
        const firstDecimalIndex = num.indexOf('.');

        if (firstDecimalIndex !== -1) {
            num = `${num.substring(0, firstDecimalIndex)}.${num
                .substring(firstDecimalIndex + 1, num.length)
                .replace(new RegExp(escapeRegExp(decimalSeparator), 'g'), '')}`;
        }

        //add negation back
        if (hasNegation && min !== 0) num = '-' + num;

        return num;
    }

    function getDisplayString(val: unknown) {
        if (val == null) return '0';

        if (val === '-') {
            return '-';
        }
        let displayValue = formatNumberWithLanguage(val as bigint | number | undefined, i18next?.language);
        if (typeof val === 'string' && (val as string).slice(-1) === '.') {
            const decimalSeparator = i18next?.language === 'vi' ? ',' : '.';
            displayValue += decimalSeparator;
        }
        return displayValue;
    }

    return <TextField value={getDisplayString(value)} onChange={handleChange} {...other} type="text" />;
};

export default NumberFormat;
