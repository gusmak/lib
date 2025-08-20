import { ReactNode } from 'react';
import { IconButtonProps, MenuItemProps } from '@mui/material';

export interface IMenu extends MenuItemProps {
    icon: ReactNode;
    name: string;
    action: () => void;
}

export interface ActionsProps extends IconButtonProps {
    menus: IMenu[];
    buttonIcon?: ReactNode;
    elementId?: string;
}
