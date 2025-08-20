import { ReactNode } from 'react';

export interface PageProps {
    caption: string;
    actions?: ReactNode;
    children?: ReactNode;
}
