import { useTranslation } from 'react-i18next';
import { TableCell, TableRow } from '@mui/material';

export type OwnProps = {
    colSpan?: number;
    title?: string;
    className?: string;
};

const NoDataTable = (props: OwnProps) => {
    const { t } = useTranslation();
    const { title, colSpan = 1, className } = props;

    return (
        <TableRow>
            <TableCell style={{ textAlign: 'center' }} className={`${className}`} colSpan={colSpan}>
                {title ? title : t('Common.NoData')}
            </TableCell>
        </TableRow>
    );
};

export default NoDataTable;
