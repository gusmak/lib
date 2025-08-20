import { useState, type MouseEvent } from 'react';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { Menu, MenuItem, Button } from '@mui/material';
import { ButtonSelectProps } from './Types';
import type { ValueBase } from 'AWING/interface';

export function ButtonSelect<Value extends ValueBase>(props: ButtonSelectProps<Value>) {
    const { elementId, options, value, onChangeSelected, ...other } = props;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (val: Value) => {
        if (onChangeSelected) onChangeSelected(val);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                id={`${elementId}-button-select`}
                aria-controls={`${elementId}-menu`}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                    textTransform: 'none',
                    color: (theme) => theme.palette.text.primary,
                    fontWeight: 'normal',
                }}
                {...other}
            />
            <Menu
                id={`${elementId}-menu`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': `${elementId}-button-select`,
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.value as unknown as string | number}
                        disabled={option.disabled}
                        selected={option.value === value}
                        onClick={() => handleMenuItemClick(option.value)}
                    >
                        {option.label ?? option.text}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

export default ButtonSelect;
