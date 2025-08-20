import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { isEmpty, isUndefined } from 'lodash';
import { ClassicDrawer } from 'Commons/Components';
import { CircularProgress, DataForm, FIELD_TYPE, textValidation } from 'AWING';
import { useGetContext } from './context';

const CreateOrEdit = () => {
    const { t } = useTranslation();
    const { id } = useParams<'id'>();
    const isCreate = isUndefined(id);

    const { services, roleTagOptions } = useGetContext();
    /* State */
    const [loading, setLoading] = useState<boolean>(isCreate ? false : true);
    const [confirmExit, setConfirmExit] = useState<boolean>(false);
    const [roleName, setRoleName] = useState<string>('');
    const [roleDescription, setRoleDescription] = useState<string>('');
    const [roleTagIds, setRoleTagIds] = useState<number[]>([]);
    const [isChangeName, setIsChangeName] = useState<boolean>(false);

    const { valid, message } = textValidation(roleName, 200);

    /** When has ID: get Role info  */
    useEffect(() => {
        if (id && services) {
            services
                .getRoleById({
                    id: Number(id),
                })
                .then((data) => {
                    setLoading(false);
                    if (data) {
                        setRoleName(data?.name ?? '');
                        setRoleDescription(data?.description ?? '');
                        if (data?.roleTags?.length) setRoleTagIds(data.roleTags.map((t) => t?.id ?? -1));
                    }
                });
        }
    }, [id]);

    const handleSubmit = async () => {
        if (isCreate) {
            return (
                services &&
                (await services.createRole({
                    input: {
                        description: roleDescription,
                        name: roleName,
                        roleTagIds,
                    },
                }))
            );
        } else {
            return (
                services &&
                (await services.updateRole({
                    id: Number(id),
                    input: {
                        description: roleDescription,
                        name: roleName,
                        roleTagIds,
                    },
                }))
            );
        }
    };

    return (
        <ClassicDrawer
            title={isCreate ? t('Role.Create') : t('Role.Edit')}
            onSubmit={handleSubmit}
            childrenWrapperStyle={{ padding: 0 }}
            disableButtonSubmit={isEmpty(roleName) || !confirmExit}
            confirmExit={confirmExit}
            data-testid="system-create-or-edit-root"
        >
            {!loading ? (
                <DataForm
                    oldValue={{
                        roleName,
                        roleDescription,
                        roleTagIds,
                    }}
                    onUpdate={(data) => {
                        if (!isEmpty(data)) {
                            setConfirmExit(true);
                            if (data?.roleName) {
                                setIsChangeName(true);
                                setRoleName(data?.roleName);
                            }
                            if (data?.roleDescription) setRoleDescription(data.roleDescription);
                            if (data?.roleTagIds) setRoleTagIds(data?.roleTagIds);
                        }
                    }}
                    fields={[
                        {
                            fieldName: 'roleName',
                            type: FIELD_TYPE.TEXT,
                            label: t('Role.Name'),
                            required: true,
                            error: isChangeName && !valid,
                            helperText: isChangeName && message,
                        },
                        {
                            fieldName: 'roleDescription',
                            type: FIELD_TYPE.TEXT,
                            label: t('Role.Description'),
                        },
                        {
                            fieldName: 'roleTagIds',
                            type: FIELD_TYPE.AUTOCOMPLETE,
                            multiple: true,
                            label: t('Role.RoleTags'),
                            options: (roleTagOptions ?? []) as any,
                        },
                    ]}
                />
            ) : (
                <CircularProgress />
            )}
        </ClassicDrawer>
    );
};

export default CreateOrEdit;
