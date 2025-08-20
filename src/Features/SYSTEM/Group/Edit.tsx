import { useEffect, useState } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import UserComponent from './User/component';
import { ClassicDrawer } from '../../../Commons';
import { Constants } from '../../../Commons/Constant';
import { useNavigate, useParams } from 'react-router';
import { CircularProgress, DataForm, FIELD_TYPE } from '../../../AWING';
import { Group, RoleAuthens } from './types';
import { useContextGroup } from './context';
import { User } from '../User/types';
import { useAppHelper } from 'Context/hooks';

interface UserRolesInput {
    key?: number;
    value?: {
        roleId?: number;
    };
}

const Edit = () => {
    const { t } = useTranslation();
    const { id } = useParams<'id'>();
    const navigate = useNavigate();
    const { services, roleTagOptions } = useContextGroup();
    const { snackbar } = useAppHelper();

    if (!id || isNaN(parseInt(id))) {
        navigate(Constants.ERROR_PATH);
    }

    const groupId = parseInt(id ?? '');

    const [users, setUsers] = useState<User[]>([]);
    const [readyForSubmit, setReadyForSubmit] = useState<boolean>(false);
    const [group, setGroup] = useState<any>({});
    const [userRoleAuthens, setUserRoleAuthens] = useState<RoleAuthens[]>([]);
    const [confirmExit, setConfirmExit] = useState(false);
    const [groupData, setGroupData] = useState<Group>();

    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const getUserGroupRoles = () => {
        const userRolesInput: UserRolesInput[] = [];

        const currentUserRoles = _.cloneDeep(
            _.get(
                group,
                'roles',
                userRoleAuthens.map((i) => i.roleId)
            ) as number[]
        );

        // add more new items
        _.each(currentUserRoles, (i) => {
            if (!_.find(userRoleAuthens, (j) => j.roleId === i)) {
                userRolesInput.push({
                    value: { roleId: i },
                });
            }
        });

        // add more items had been removed
        _.each(userRoleAuthens, (i) => {
            if (!_.includes(currentUserRoles, i.roleId)) {
                userRolesInput.push({
                    key: i.id,
                });
            }
        });

        return userRolesInput;
    };

    const onEditUserGroup = async () => {
        setLoadingUpdate(true);
        return (
            services &&
            (await services
                .updateGroup({
                    id: Number(groupId),
                    input: {
                        name: group.name,
                        roleAuthens: getUserGroupRoles(),
                        description: group.description,
                        userIds: users.map((x) => x.id).filter((id): id is number => id !== undefined),
                    },
                })
                .then(() => snackbar('success'))
                .catch(() => snackbar('error'))
                .finally(() => setLoadingUpdate(false)))
        );
    };

    useEffect(() => {
        if (groupId && services) {
            setLoading(true);
            services
                .getGroupById({
                    id: Number(groupId),
                })
                .then((data) => {
                    setLoading(false);
                    if (data) {
                        setGroupData(data);
                        if (data?.users) {
                            const newUsers = data?.users?.map((item) => ({
                                id: item?.id,
                                username: item?.username,
                                name: item?.name,
                            }));
                            setUsers(newUsers);
                        }
                        setUserRoleAuthens(
                            _.map(_.get(data, 'roleAuthens', []), (i) => ({
                                id: i?.id ?? 0,
                                roleId: i?.roleId ?? 0,
                                roleName: i?.role?.name ?? '',
                            }))
                        );
                        setGroup({
                            name: data?.name ?? '',
                            description: data?.description ?? '',
                        });
                        setReadyForSubmit(true);
                    }
                })
                .catch(() => snackbar('error'))
                .finally(() => setLoading(false));
        }
    }, [groupId]);

    return (
        <ClassicDrawer
            title={t('UserGroup.TitleEdit')}
            onSubmit={onEditUserGroup}
            isLoadingButtonSubmit={loadingUpdate}
            disableButtonSubmit={!(confirmExit && readyForSubmit)}
            confirmExit={confirmExit}
            childrenWrapperStyle={{ padding: 0 }}
        >
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <DataForm
                        fields={[
                            {
                                fieldName: 'name',
                                type: FIELD_TYPE.TEXT,
                                label: t('UserGroup.Name'),
                                length: 200,
                                required: true,
                            },
                            {
                                fieldName: 'roles',
                                multiple: true,
                                type: FIELD_TYPE.AUTOCOMPLETE,
                                label: t('User.Roles'),
                                // TODO: Fix this type any sau khi component DataForm được sửa
                                options: roleTagOptions as any,
                            },
                            {
                                fieldName: 'description',
                                type: FIELD_TYPE.TEXT_AREA,
                                length: 500,
                                label: t('UserGroup.Description'),
                            },
                        ]}
                        oldValue={
                            groupData
                                ? {
                                      name: groupData.name,
                                      roles: _.map(groupData.roleAuthens, (i) => i?.roleId),
                                      description: groupData.description,
                                  }
                                : undefined
                        }
                        onUpdate={(value, formValid) => {
                            if (!_.isEmpty(value)) {
                                setReadyForSubmit(formValid);
                                value && setGroup(value);
                                setConfirmExit(true);
                            }
                        }}
                    />
                    <UserComponent
                        rows={users}
                        onSubmitData={(users) => {
                            setUsers(users);
                            setConfirmExit(true);
                        }}
                    />
                </>
            )}
        </ClassicDrawer>
    );
};

export default Edit;
