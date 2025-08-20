import { CSSProperties } from 'react';
import { CircularProgress as MuiCircularProgress } from '@mui/material';

export type ICircularProgress = {
    styleWrap?: CSSProperties;
    styleIcon?: CSSProperties;
};

export const CircularProgress = (props: ICircularProgress) => {
    const { styleWrap = {}, styleIcon = {} } = props;
    return (
        <div style={{ textAlign: 'center', padding: 4 * 8, ...styleWrap }}>
            <MuiCircularProgress sx={{ ...styleIcon }} />
        </div>
    );
};

export default CircularProgress;
