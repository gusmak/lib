import { CircularProgress, DataForm } from 'AWING';
import { ClassicDrawer } from 'Commons/Components';
import { Constants } from 'Commons/Constant';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useContextUser } from './context';
import { RoleAuthens, User } from './types';
import { cloneDeep, each, find, get, includes, isEmpty, map } from 'lodash';
import { FIELD_TYPE } from 'AWING/DataInput';

interface UserRoleInput {
    id?: number;
    value?: {
        roleId: number;
    };
}

const Edit = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<'id'>();

    !id && navigate(Constants.ERROR_PATH);
    const userId = Number(id);

    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingUpdateUser, setLoadingUpdateUser] = useState(false);
    const [readyForSubmit, setReadyForSubmit] = useState(false);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [userRoleAuthens, setUserRoleAuthens] = useState<RoleAuthens[]>([]);
    const [confirmExit, setConfirmExit] = useState(false);

    const { services, roleTagOptions, groupsTagOptions } = useContextUser();

    const getUserRoles = () => {
        const userRolesInput: UserRoleInput[] = [];
        const currentUserRoles: number[] = cloneDeep(
            get(
                user,
                'roles',
                userRoleAuthens.map((i) => i.roleId)
            ) as number[]
        );

        // add more new items
        each(currentUserRoles, (i) => {
            if (!find(userRoleAuthens, (j) => j.roleId === i)) {
                userRolesInput.push({
                    value: { roleId: i },
                });
            }
        });

        // add more items had been removed
        each(userRoleAuthens, (i) => {
            if (!includes(currentUserRoles, i.roleId)) {
                userRolesInput.push({
                    id: i.id,
                });
            }
        });

        return userRolesInput;
    };

    const onUpdateUser = async () => {
        if (!services) return;
        setLoadingUpdateUser(true);
        await services
            .updateUser({
                id: userId,
                user: {
                    userRequest: {
                        name: user?.name,
                        description: user?.description,
                    },
                    roleAuthens: {
                        roleAuthens: getUserRoles(),
                    },
                    groupIds: user?.groups || [],
                },

            })
            .finally(() => {
                setLoadingUpdateUser(false);
            });
    };

    useEffect(() => {
        if (services) {
            setLoadingUser(true);
            services
                .getUserById({ id: Number(userId) })
                .then((data) => {
                    setUser(data);
                    setUserRoleAuthens(
                        map(get(data, 'roleAuthens', []), (i) => ({
                            id: i.id,
                            roleId: i.roleId,
                            roleName: i?.role?.name,
                        }))
                    );
                })
                .finally(() => {
                    setLoadingUser(false);
                });
        }
    }, []);

    return (
        <ClassicDrawer
            title={t('User.TitleEdit')}
            onSubmit={onUpdateUser}
            isLoadingButtonSubmit={loadingUpdateUser}
            disableButtonSubmit={!readyForSubmit}
            confirmExit={confirmExit}
            childrenWrapperStyle={{ padding: '0' }}
        >
            {loadingUser ? (
                <CircularProgress />
            ) : (
                <DataForm
                    fields={[
                        {
                            fieldName: 'name',
                            type: FIELD_TYPE.TEXT,
                            label: t('User.Name'),
                            required: true,
                            length: 200,
                        },
                        {
                            fieldName: 'roles',
                            // multiple: true,
                            type: FIELD_TYPE.AUTOCOMPLETE,
                            label: t('User.Roles'),
                            options: roleTagOptions as any,
                        },
                        //Todo: API getUserById does not return groups, so we need to handle it later
                        {
                            fieldName: 'groups',
                            multiple: true,
                            type: FIELD_TYPE.AUTOCOMPLETE,
                            label: t('User.Groups'),
                            options: groupsTagOptions as any,
                        },
                        {
                            fieldName: 'description',
                            type: FIELD_TYPE.TEXT_AREA,
                            length: 500,
                            label: t('UserGroup.Description'),
                        },
                    ]}
                    oldValue={
                        user
                            ? {
                                  name: user.name,
                                  roles: user?.roleAuthens?.map((i) => i.roleId),
                                  description: user.description,
                                  groups: user.groups,
                              }
                            : undefined
                    }
                    onUpdate={(obj, formValid) => {
                        if (!isEmpty(obj)) {
                            obj &&
                                setUser({
                                    ...user,
                                    ...obj,
                                    roles: obj.roles?.filter((role): role is number => role !== undefined),
                                    groups: obj.groups?.filter((group): group is number => group !== undefined),
                                });
                            setConfirmExit(true);
                            setReadyForSubmit(formValid);
                        }
                    }}
                />
            )}
        </ClassicDrawer>
    );
};

export default Edit;
