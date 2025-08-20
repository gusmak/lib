import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TableRow, Tooltip, Box, Typography } from '@mui/material';
import { Constants } from '../../constants';
import { Close, Person, People, ManageAccounts, CallSplit, ArrowRightAlt } from '@mui/icons-material';
import type { PermissionView } from '../../types';
import type { OwnProps } from './types';
import { StyledCheck, StyledTableCell } from './Styled';

/** Lấy icon theo loại quyền và hiển thị tooltip tương ứng */
export const getAuthenIcon = (authenType?: string) => {
    let icon = <ManageAccounts />;

    switch (authenType) {
        case Constants.AUTHEN_TYPE.USER:
            icon = <Person />;
            break;
        case Constants.AUTHEN_TYPE.GROUP:
            icon = <People />;
            break;
        case Constants.AUTHEN_TYPE.ROLE:
            icon = <ManageAccounts />;
            break;
    }

    return <Tooltip title={<Typography>{authenType}</Typography>}>{icon}</Tooltip>;
};

/** Kiểm tra quyền và render checked */
export const getCellCheckbox = (permission: number, permissionName: keyof typeof Constants.PERMISSION_CODE) => {
    return (
        <StyledTableCell style={{ textAlign: 'left' }}>
            {(permission & Constants.PERMISSION_CODE[permissionName]) === Constants.PERMISSION_CODE[permissionName] ? (
                <StyledCheck color="primary" />
            ) : null}
        </StyledTableCell>
    );
};

function ViewPermission(props: OwnProps) {
    const { permission, index, onEdit, onDelete } = props;
    const { t } = useTranslation();

    const handleDelete = (event: MouseEvent, permission: PermissionView) => {
        event.stopPropagation();
        onDelete && onDelete(permission);
    };

    return (
        <TableRow
            hover
            tabIndex={-1}
            key={index}
            sx={(theme) => ({
                padding: theme.spacing(1.7, 2),
                borderBottom: '1px solid #a3a3a345',
                '&.MuiTableRow-root.MuiTableRow-hover:hover': {
                    cursor: `pointer`,
                    '& .isShowIcon': {
                        visibility: 'visible',
                    },
                },
                maxWidth: '300px',
                wordBreak: 'break-all',
                cursor: 'pointer',
            })}
            onClick={() => onEdit(permission.authenValue, permission.authenType)}
        >
            <StyledTableCell>{index + 1}</StyledTableCell>
            <StyledTableCell>{getAuthenIcon(permission.authenType)}</StyledTableCell>
            <StyledTableCell>{permission.name}</StyledTableCell>

            {getCellCheckbox(permission.permission, 'FULL_CONTROL')}
            {getCellCheckbox(permission.permission, 'MODIFY')}
            {getCellCheckbox(permission.permission, 'WRITE')}
            {getCellCheckbox(permission.permission, 'READ_AND_EXECUTE')}
            {getCellCheckbox(permission.permission, 'READ')}
            {getCellCheckbox(permission.permission, 'LIST_FOLDER_CONTENTS')}

            <StyledTableCell
                sx={{
                    width: 20,
                    padding: `0px`,
                    position: 'relative',
                    textAlign: 'end',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {permission.matrices?.length ? (
                        <Tooltip
                            title={
                                <Box>
                                    {permission.matrices.map((matrix) => (
                                        <Box
                                            key={`per_${matrix.stateStartNavigation?.id}_${matrix.stateEndNavigation?.id}`}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <Typography>{matrix.stateStartNavigation?.name}</Typography>
                                            <ArrowRightAlt sx={{ margin: '0px 8px' }} />
                                            <Typography>{matrix.stateEndNavigation?.name}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            }
                        >
                            <CallSplit
                                sx={{
                                    margin: '0px 16px',
                                }}
                                onClick={(event: MouseEvent) => event.stopPropagation()}
                            />
                        </Tooltip>
                    ) : null}
                    {permission.canDelete ? (
                        <Tooltip
                            sx={{
                                backgroundColor: '#ffffff',
                                color: '#212121',
                                borderRadius: 0,
                                border: '1px solid rgba(0, 0, 0, 0.23)',
                                fontSize: '11px',
                                fontWeight: 'normal',
                            }}
                            title={t('Common.Delete')}
                        >
                            <Close
                                className={`isShowIcon`}
                                sx={{
                                    marginRight: 2,
                                    visibility: 'hidden',
                                }}
                                onClick={(event: MouseEvent) => handleDelete(event, permission)}
                            />
                        </Tooltip>
                    ) : null}
                </div>
            </StyledTableCell>
        </TableRow>
    );
}

export default ViewPermission;
