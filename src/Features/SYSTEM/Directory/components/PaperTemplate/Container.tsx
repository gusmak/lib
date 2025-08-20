import { ReactNode } from 'react';
import { Paper } from '@mui/material';

export type OwnProps = {
    children?: ReactNode;
};

const Container = (props?: OwnProps) => {
    return (
        <Paper
            sx={{
                boxShadow: `0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)`,
                borderRadius: '4px',
                borderCollapse: 'collapse',
                paddingTop: '1px',
                borderBottom: '1px solid #ececec',
            }}
            data-testid="paper-template-root"
        >
            {props?.children}
        </Paper>
    );
};

export default Container;
