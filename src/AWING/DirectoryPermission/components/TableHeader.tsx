import { TableCell, TableRow, TableHead, Tooltip, Grid, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';
import { type HeadCell } from './PermissionTable';

export type OwnProps = {
    headCells: HeadCell[];
};

export const getCellWidth = (id?: string) => {
    switch (id) {
        case 'stt':
        case 'authenType':
            return '5%';

        case 'authenName':
            return '18%';

        case 'readAndExecute':
        case 'listFolderContents':
            return '16%';

        default:
            return '10%';
    }
};

const TableHeader = (props: OwnProps) => {
    const { headCells } = props;

    return (
        <TableHead>
            <TableRow sx={{ flex: '1 1 100%' }}>
                {headCells.map((headCell: HeadCell, index: number) => (
                    <TableCell
                        key={index}
                        sx={(theme) => ({
                            width: getCellWidth(headCell?.id),
                            fontWeight: 'bold',
                            paddingLeft: theme.spacing(1),
                            paddingRight: theme.spacing(1),
                        })}
                    >
                        <Grid direction="row" container sx={{ alignItems: 'center'}}>
                            <Typography>{headCell.label}</Typography>
                            {headCell?.explain && (
                                <Tooltip title={headCell.explain}>
                                    <Info
                                        color="secondary"
                                        sx={{
                                            fontSize: '16px',
                                            margin: 0.2,
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Grid>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

export default TableHeader;
