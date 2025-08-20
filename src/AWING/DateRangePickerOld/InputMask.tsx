import {
    useMask,
    // formatToParts,
    // generatePattern
} from '@react-input/mask';
import { CalendarTodaySharp as IconCalendarTodaySharp } from '@mui/icons-material';
import { TextField, InputAdornment, IconButton } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { omit } from 'lodash';

const maskInit = '__/__/____ - __/__/____';

const InputMask = (props: any) => {
    const { t } = useTranslation();
    const { inputValue, required, id, variant, label, isValid, error, disableHelperText, helperText, onClickInput } = props;
    const inputRef = useMask({
        mask: maskInit,
        replacement: { _: /\d/ },
        showMask: true,
        modify: (_value) => {
            // if (value.inputType === 'deleteBackward') {
            //     return {
            //         mask: maskInit,
            //     };
            // }

            return {
                mask: inputValue,
            };
        },
    });
    // const handleInputMaskChanged = (event: any) => {
    //     const maskedValue = event.target.value;
    //     const parts = formatToParts(maskedValue, { mask: maskInit, replacement: { _: /\d/ } });
    //     const pattern = generatePattern('full-inexact', { mask: maskInit, replacement: { _: /\d/ } });
    //     const isValid = RegExp(pattern).test(maskedValue);

    //     if (onChange) {
    //         onChange({
    //             maskedValue,
    //         });
    //     }
    // };

    return (
        <div
            style={{
                position: 'relative',
                // height: '56px',
            }}
        >
            {/* <input
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '4px',
                    paddingLeft: '14px',
                    width: 'calc(100% - 48px)',
                    height: 'calc(100% - 2px)',
                    boxSizing: 'border-box',
                    border: 'none',
                    zIndex: 2,
                    '&:focus': {
                        outline: 'none'}
                }}
                ref={inputRef}
                onChange={handleInputMaskChanged}
                value={inputValue}
                placeholder="99/99/9999 - 99/99/9999"
                name="dsadd"
            /> */}
            <TextField
                // onChange={handleInputMaskChanged}
                // value={inputValue}
                data-testid="date-range-picker-inputmask"
                required={required}
                aria-describedby={id}
                variant={variant}
                label={label}
                error={!isValid || error}
                helperText={
                    !disableHelperText
                        ? error
                            ? helperText || t('Common.InvalidData')
                            : !isValid
                              ? t('DatePicker.InvalidDateRange')
                              : ''
                        : ''
                }
                {...omit(props.textFieldProps, ['readOnly'])}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                    <IconCalendarTodaySharp />
                                </IconButton>
                            </InputAdornment>
                        ),
                        // onChange: handleInputMaskChanged,
                        value: inputValue,
                        // readOnly: props.textFieldProps?.readOnly,
                        // readOnly: true,
                    },
                }}
                disabled={props.disabled}
                onClick={(e) => {
                    !props.textFieldProps?.readOnly && onClickInput(e);
                }}
                style={
                    {
                        // minWidth: '265px',
                    }
                }
                // sx={{
                //     '.MuiInputBase-root .MuiOutlinedInput-input': {
                //         padding: `10px 0`,
                //         paddingLeft: '14px',
                //     },
                // }}
                // size="small"
                inputRef={inputRef}
            />
        </div>
    );
};

export default InputMask;
