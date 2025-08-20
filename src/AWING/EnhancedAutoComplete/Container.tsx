import { useState, Fragment, MouseEvent, SyntheticEvent } from 'react';
import { Popper, Autocomplete, Button, InputBase, Box, type AutocompleteCloseReason } from '@mui/material';
import { Done as DoneIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { EnhancedAutoCompleteProps } from './Types';
import type { ValueBase, MenuOption } from 'AWING/interface';

const HeaderLabel = styled('div')(() => {
    return {
        borderBottom: '1px solid #e1e4e8',
        padding: '8px 10px',
        background: '#fafafa',
    };
});

function Container<OptionValue extends ValueBase, Option extends MenuOption<OptionValue>>(
    props: EnhancedAutoCompleteProps<OptionValue, Option>
) {
    const { field, value, labelStyle, popperStyle, onChangeValue } = props;
    const { options = [], loading } = field;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [pendingValue, setPendingValue] = useState<Option | null>();

    const open = Boolean(anchorEl);
    const id = open ? 'github-label' : undefined;

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setPendingValue(value);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (_event: SyntheticEvent, reason: AutocompleteCloseReason) => {
        if (reason === 'toggleInput') {
            return;
        }
        if (anchorEl) {
            anchorEl.focus();
        }
        if (pendingValue || value) {
            const currentOption = options.find((option) => option.value === value?.value);
            currentOption && onChangeValue(currentOption);
        }

        setAnchorEl(null);
    };

    return (
        <Fragment>
            <Button
                id={`button-autocomplete`}
                aria-controls={'menu'}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                    textTransform: 'none',
                    color: (theme) => theme.palette.text.primary,
                    fontWeight: 'normal',
                    ...labelStyle,
                }}
                children={field.label}
            />
            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement="bottom-start"
                sx={{
                    border: '1px solid rgba(27,31,35,.15)',
                    boxShadow: '0 3px 12px rgba(27,31,35,.15)',
                    borderRadius: '3px',
                    width: 300,
                    zIndex: 1,
                    color: '#586069',
                    background: '#fafafa',
                    ...popperStyle,
                }}
            >
                <HeaderLabel>{field.label}</HeaderLabel>
                <Autocomplete
                    open
                    onClose={handleClose}
                    options={options}
                    sx={{
                        '& .MuiAutocomplete-paper': {
                            overflowX: 'hidden',
                            borderRight: '1px solid rgba(27,31,35,.15)',
                            boxShadow: 'none',
                            color: '#586069',
                        },
                        '& .MuiAutocomplete-popperDisablePortal': {
                            position: 'relative',
                        },
                        '& 	.MuiAutocomplete-listbox': {
                            border: '1px solid rgba(27,31,35,.15)',
                            borderRadius: '3px',
                            width: 300,
                            zIndex: 1,
                            color: '#586069',
                        },
                    }}
                    size="small"
                    getOptionLabel={(option) => {
                        return option.text;
                    }}
                    onChange={(_e, val) => {
                        setPendingValue(val);
                    }}
                    value={pendingValue}
                    loading={loading}
                    disablePortal
                    fullWidth
                    renderTags={() => null}
                    noOptionsText="No labels"
                    isOptionEqualToValue={(option, value) => {
                        return option.value === value.value;
                    }}
                    renderOption={(_props, option, _state) => {
                        const selected = option.value === pendingValue?.value;
                        return (
                            <Box
                                sx={(theme) => ({
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: theme.spacing(1),
                                    '&:hover': {
                                        backgroundColor: theme.palette.secondary.main,
                                    },
                                })}
                                onClick={(_e) => {
                                    onChangeValue(option);
                                    setAnchorEl(null);
                                }}
                            >
                                <DoneIcon
                                    style={{
                                        visibility: selected ? 'visible' : 'hidden',
                                        fontSize: 'small',
                                        marginRight: '8px',
                                    }}
                                />
                                <div>{option.text}</div>
                            </Box>
                        );
                    }}
                    renderInput={(params) => (
                        <InputBase
                            ref={params.InputProps.ref}
                            inputProps={params.inputProps}
                            autoFocus
                            sx={(theme) => ({
                                padding: 1,
                                width: '100%',
                                borderBottom: '1px solid #dfe2e5',
                                background: '#fafafa',
                                '& input': {
                                    borderRadius: '4px',
                                    backgroundColor: theme.palette.common.white,
                                    padding: 1,
                                    transition: theme.transitions.create(['border-color', 'box-shadow']),
                                    border: '1px solid #ced4da',
                                },
                            })}
                        />
                    )}
                />
            </Popper>
        </Fragment>
    );
}

export default Container;
