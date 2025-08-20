import type { ReactNode, ReactElement } from 'react';

export interface DrawerNavigateProps {
    title?: string;
    customAction?: ReactElement;
    customButtonSubmit?: ReactElement;
    children: ReactNode;
    childrenWrapperStyle?: any;
    wrapperStyle?: any;
}
