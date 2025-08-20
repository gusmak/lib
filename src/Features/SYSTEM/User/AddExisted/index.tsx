import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce, map } from 'lodash';
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@mui/icons-material';
import { Autocomplete, CircularProgress, Paper, TextField, Checkbox, Grid } from '@mui/material';
import { ClassicDrawer } from 'Commons/Components';
import { useContextUser } from '../context';
import { DEBOUNCE_TIME } from '../utils';
import type { RoleTagOptions } from '../types';
import { useAppHelper } from 'Context/hooks';

const AddExistedUser = () => {
    const { t } = useTranslation();

    const [userName, setUserName] = useState<string>('');
    const [confirmExit, setConfirmExit] = useState(false);
    const [readyToSubmit, setReadyToSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputOptions, setInputOptions] = useState<{
        newRoles: RoleTagOptions[];
        newGroups: RoleTagOptions[];
    }>({
        newRoles: [],
        newGroups: [],
    });
    const [error, setError] = useState<string>('');
    const { services, roleTagOptions, groupsTagOptions } = useContextUser();

    const { snackbar } = useAppHelper();
    const handleErrorState = (value: string) => {
        setUserName('');
        setError(value);
    };

    const handleChange = useCallback(
        debounce((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setError('');
            setConfirmExit(true);
            const userName = e.target.value.trim();
            if (userName && services) {
                setLoading(true);
                services
                    .checkUsernameExisted({
                        username: userName,
                    })
                    ?.then((res) => {
                        if (res) {
                            setReadyToSubmit(true);
                            setUserName(userName);
                        } else {
                            handleErrorState(t('InvalidMessage.InvalidNotExisted'));
                            setReadyToSubmit(false);
                        }
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setReadyToSubmit(false);
                handleErrorState(t('Common.InvalidData'));
            }
        }, DEBOUNCE_TIME),
        [services]
    );

    const handleChangeOptions = (value: RoleTagOptions[], fielName: 'newRoles' | 'newGroups') => {
        setInputOptions((prev) => ({
            ...prev,
            [fielName]: value,
        }));
    };

    const handleAddExisted = () => {
        return (
            services &&
            services
                .addToWorkspace({
                    username: userName,
                    roleAuthenInput: {
                        roleAuthens: map(inputOptions.newRoles, (i) => ({
                            value: { roleId: i.value },
                        })),
                    },
                    groupIds: map(inputOptions.newGroups, (i) => i.value).filter(
                        (id): id is number => id !== undefined
                    ),
                })
                .then(() => {
                    snackbar('success');
                })
                .catch((error) => {
                    snackbar('error', error?.message);
                })
        );
    };

    return (
        <ClassicDrawer
            title={t('User.AddExistedUser')}
            onSubmit={handleAddExisted}
            isLoadingButtonSubmit={false}
            disableButtonSubmit={!readyToSubmit}
            confirmExit={confirmExit}
            childrenWrapperStyle={{ padding: (theme) => theme.spacing(3) }}
        >
            <Grid component={Paper} sx={{ padding: (theme) => theme.spacing(3) }}>
                <TextField
                    label={t('User.Username')}
                    name="username"
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                    required
                    error={!!error}
                    autoComplete="off"
                    helperText={t(error)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <CircularProgress
                                    sx={{
                                        width: '24px!important',
                                        height: '24px!important',
                                        right: '0',
                                        visibility: loading ? 'visible' : 'hidden',
                                    }}
                                />
                            ),
                        },
                    }}
                />
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    data-testid="AutocompleteRole"
                    options={roleTagOptions ?? []}
                    disableCloseOnSelect
                    onChange={(_e, value) => handleChangeOptions(value, 'newRoles')}
                    getOptionLabel={(option) => option.text ?? ''}
                    renderOption={(props, option, { selected }) => {
                        const { id, ...optionProps } = props;
                        return (
                            <li {...optionProps}>
                                <Checkbox
                                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option.text}
                            </li>
                        );
                    }}
                    renderInput={(params) => <TextField {...params} label={t('User.Roles')} variant="standard" />}
                />
                <Autocomplete
                    multiple
                    id="checkboxes-tags-groups-demo"
                    data-testid="AutocompleteGroups"
                    options={groupsTagOptions ?? []}
                    disableCloseOnSelect
                    onChange={(_e, value) => handleChangeOptions(value, 'newGroups')}
                    getOptionLabel={(option) => option.text ?? ''}
                    renderOption={(props, option, { selected }) => {
                        const { id, ...optionProps } = props;
                        return (
                            <li {...optionProps}>
                                <Checkbox
                                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option.text}
                            </li>
                        );
                    }}
                    renderInput={(params) => <TextField {...params} label={t('User.Groups')} variant="standard" />}
                />
            </Grid>
        </ClassicDrawer>
    );
};
export default AddExistedUser;
