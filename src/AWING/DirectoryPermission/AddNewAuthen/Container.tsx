import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import { ClassicDrawer } from 'Commons/Components';
import { CircularProgress } from 'AWING';
import { useGetDirectoryContext } from '../context';
import { Constants } from '../constants';
import { useAuthenMemoByKey } from '../hooks';
import { getAuthenByType, getNewAuthens, formatAuthensInfo, filterAuthenIncludeIdByType } from '../utils';
import SearchWrapper from './SearchWrapper';
import { AuthenPermission, Authen, AuthenType, AuthenTypeEnum } from '../types';
import type { ContainerProps } from './types';

const Container = (props: ContainerProps) => {
    const { t } = useTranslation();
    const { services } = useGetDirectoryContext();
    const { authenPermissions, onTempPermissionsChange, drawerLevel, onDrawerLevelChange } = props;

    const [authenIds, setAuthensByType] = useAuthenMemoByKey<number>();
    const [allAuthens, setAllAuthens] = useState<{ [K in AuthenType]: Authen[] }>({ User: [], Group: [], Role: [] });

    const [loading, setLoading] = useState<boolean>(true);
    const [confirmExit, setConfirmExit] = useState<boolean>(false);

    useEffect(() => {
        if (services) {
            setLoading(true);
            Promise.all([services.getRoles(), services.getUsers(), services.getGroups()])
                .then(([r, u, g]) => {
                    const Authens = Constants.AUTHEN_TYPE;
                    let result = {
                        Role: formatAuthensInfo(r.items, Authens.ROLE),
                        User: formatAuthensInfo(u.items, Authens.USER),
                        Group: formatAuthensInfo(g.items, Authens.GROUP),
                    };
                    setAllAuthens(result);
                })
                .finally(() => setLoading(false));
        }
    }, []);

    const keyOfAuthenType = Object.keys(AuthenTypeEnum).filter((key) => isNaN(Number(key))) as Array<keyof typeof AuthenTypeEnum>;

    useEffect(() => {
        // Set default value
        keyOfAuthenType.forEach((type) => {
            setAuthensByType(type, getAuthenByType(authenPermissions, type));
        });
    }, [authenPermissions]);

    const handleAuthenIdsChange = (authenIds: number[], type: AuthenType) => {
        setConfirmExit(true);
        setAuthensByType(type, authenIds);
    };

    const handleSubmitAddNewAuth = (authenIds: { [K in AuthenType]: number[] }) => {
        const authens = [...allAuthens.Group, ...allAuthens.User, ...allAuthens.Role];
        let newPermissions: AuthenPermission[] = [];
        keyOfAuthenType.forEach((type) => {
            if (authenIds[type].length > 0) {
                const newAuthens = filterAuthenIncludeIdByType(authens, authenIds[type], type);
                newPermissions = [...newPermissions, ...getNewAuthens(newAuthens, authens)];
            }
        });
        drawerLevel && onDrawerLevelChange && onDrawerLevelChange(drawerLevel - 1);
        onTempPermissionsChange(newPermissions);
        return Promise.resolve();
    };

    return (
        <ClassicDrawer
            title={t('DirectoryManagement.TitleAddUserGroupUser')}
            onSubmit={() => handleSubmitAddNewAuth(authenIds)}
            width={drawerLevel && drawerLevel > 3 ? '100%' : '80%'}
            onClose={() => {
                drawerLevel && onDrawerLevelChange && onDrawerLevelChange(drawerLevel - 1);
            }}
            confirmExit={confirmExit}
        >
            <Grid container sx={{ flexGrow: 1, padding: (theme) => theme.spacing(2) }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <SearchWrapper authenIds={authenIds} authens={allAuthens} onAuthenIdsChange={handleAuthenIdsChange} />
                )}
            </Grid>
        </ClassicDrawer>
    );
};

export default Container;
