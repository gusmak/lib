import { type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Grid, Typography, Chip, Button, Stack, TextField, MenuItem } from '@mui/material';
import { Constants, BORDER_LIGHTGRAY, OBJECT_TYPE_CODE_NONE, DEFAULT_DIRECTORY_TYPE, OBJECT_TYPE_CODE_ALL } from '../constants';
import type { AuthenPermission } from '../types';
import { useGetDirectoryContext } from '../context';

export type OwnProps = {
    isCreate?: boolean;
    objectTypeCodeSelected?: string;
    authenPermissions?: AuthenPermission[];
    onChangeObjectTypeCode?: (objectTypeCode: string) => void;
    onDeleteAuthen?: (authen: AuthenPermission) => void;
    onDrawerLevelChange?: (level: number) => void;
};

function AddOrEditHeader(props: OwnProps) {
    const { t } = useTranslation();
    const { isCreate, objectTypeCodeSelected, authenPermissions = [], onDeleteAuthen, onDrawerLevelChange, onChangeObjectTypeCode } = props;

    const { objectTypeCodes = [] } = useGetDirectoryContext();

    const handleChangeObjectTypeCode = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target?.value;
        onChangeObjectTypeCode && onChangeObjectTypeCode(value);
    };

    const newObjectTypeCodeSelected = objectTypeCodeSelected || OBJECT_TYPE_CODE_ALL;

    return (
        <div>
            <Grid size={{ xs: 12 }} sx={{ marginBottom: 2 }}>
                <Stack sx={{ marginBottom: 4 }}>
                    <TextField
                        autoFocus
                        label={t('Schema.ObjectLabel')}
                        select
                        value={newObjectTypeCodeSelected}
                        onChange={handleChangeObjectTypeCode}
                        // required={true}
                        variant="standard"
                        fullWidth
                        disabled={!isCreate}
                        data-testid="objectTypeCode"
                    >
                        {objectTypeCodes.map((option) => (
                            <MenuItem key={option.key} value={option.key}>
                                {option.key === OBJECT_TYPE_CODE_NONE ? DEFAULT_DIRECTORY_TYPE : option.value}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>

                <Typography
                    component="p"
                    sx={{
                        marginBottom: 1,
                        fontWeight: '500',
                    }}
                >
                    {isCreate ? t('DirectoryManagement.AddAuthen') : t(`DirectoryManagement.Edit.${authenPermissions[0].authenType}`)}
                </Typography>
                {authenPermissions.length ? (
                    <Stack flexWrap="wrap" direction="row" marginBottom={2}>
                        {Object.assign([], authenPermissions).map((authen: AuthenPermission, index: number) => {
                            const property =
                                isCreate && onDeleteAuthen
                                    ? {
                                          onDelete: () => onDeleteAuthen(authen),
                                      }
                                    : {};

                            return (
                                <Chip
                                    key={index}
                                    sx={(theme) => ({
                                        margin: 1,
                                        backgroundColor: theme.palette.action.hover,
                                    })}
                                    variant="outlined"
                                    label={authen.name}
                                    {...property}
                                />
                            );
                        })}
                    </Stack>
                ) : null}
                {!!isCreate && (
                    <Button
                        component={Link}
                        variant="outlined"
                        sx={(theme) => ({
                            backgroundColor: theme.palette.action.hover,
                            '&:hover': {
                                backgroundColor: theme.palette.secondary.main,
                                border: BORDER_LIGHTGRAY,
                            },
                            color: theme.palette.text.primary,
                            border: BORDER_LIGHTGRAY,
                        })}
                        to={Constants.ADD_NEWAUTHEN_PATH}
                        onClick={() => {
                            onDrawerLevelChange && onDrawerLevelChange(3);
                        }}
                    >
                        {t('DirectoryManagement.addTitle')}
                    </Button>
                )}
            </Grid>
        </div>
    );
}

export default AddOrEditHeader;
