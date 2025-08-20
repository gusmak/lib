import { useState } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import UserComponent from './User/component';
import { ClassicDrawer } from '../../../Commons';
import { DataForm, FIELD_TYPE } from '../../../AWING';
import { useContextGroup } from './context';
import { User } from '../User/types';
import { useAppHelper } from 'Context/hooks';

const Create = () => {
    const { t } = useTranslation();
    const { snackbar } = useAppHelper();
    const [group, setGroup] = useState<any>({});
    const [users, setUsers] = useState<User[]>([]);

    const [readyForSubmit, setReadyForSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmExit, setConfirmExit] = useState(false);
    const { services, roleTagOptions } = useContextGroup();

    // const [createUserGroup, { loading: loadingCreateUserGroup }] = useCreateGroupMutation();

    const onCreateUserGroup = () => {
        if (services) {
            setLoading(true);
            return services
                .createGroup({
                    input: {
                        name: group.name,
                        description: group.description,
                        roleAuthens: _.map(group?.roles, (i) => ({
                            value: { roleId: i },
                        })),
                        userIds: users.map((x) => x.id).filter((id): id is number => id !== undefined),
                    },
                })
                .then(() => snackbar('success'))
                .catch(() => snackbar('error'))
                .finally(() => setLoading(false));
        }
    };

    return (
        <ClassicDrawer
            title={t('UserGroup.TitleCreate')}
            confirmExit={confirmExit}
            onSubmit={onCreateUserGroup}
            childrenWrapperStyle={{ padding: 0 }}
            isLoadingButtonSubmit={loading}
            disableButtonSubmit={!(confirmExit && readyForSubmit)}
        >
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
                onUpdate={(value, formValid) => {
                    setReadyForSubmit(formValid);
                    value && setGroup(value);
                    setConfirmExit(true);
                }}
            />
            <UserComponent
                rows={users}
                onSubmitData={(users) => {
                    setUsers(users);
                    setConfirmExit(true);
                }}
            />
        </ClassicDrawer>
    );
};

export default Create;
