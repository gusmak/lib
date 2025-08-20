import { useEffect, useState } from 'react';
import { includes, isUndefined, isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ClassicDrawer } from 'Commons/Components';
import { textValidation, DataForm, CircularProgress, FIELD_TYPE } from 'AWING';
import { useGetContext } from './context';
import type { RoleTagInput } from './types';

const CreateOrEdit = () => {
    const { t } = useTranslation();
    const { id } = useParams<'id'>();
    const isCreate = isUndefined(id);

    const { services, roleOptions = [] } = useGetContext();
    /* State */
    const [loading, setLoading] = useState<boolean>(isCreate ? false : true);
    const [confirmExit, setConfirmExit] = useState<boolean>(false);
    const [roleTagName, setRoleTagName] = useState<string>('');
    const [roleTagDescription, setRoleTagDescription] = useState<string>('');
    const [roleIds, setRoleIds] = useState<number[]>([]);
    const [isChangeName, setIsChangeName] = useState<boolean>(false);

    const { valid, message } = textValidation(roleTagName, 200);

    useEffect(() => {
        if (id && services) {
            services
                .getRoleTagById({
                    id: Number(id),
                })
                .then((data) => {
                    setLoading(false);
                    if (data) {
                        setRoleTagName(data?.name ?? '');
                        setRoleTagDescription(data?.description ?? '');

                        const roleIds = roleOptions
                            .filter((r) => includes(r?.roleTagIds ?? [], data?.id))
                            ?.map((i) => i.value);
                        roleIds && setRoleIds(roleIds);
                    }
                });
        }
    }, [id]);

    const handleSubmit = async () => {
        if (!services) return;
        const input: RoleTagInput = {
            name: roleTagName,
            description: roleTagDescription,
            roleIds,
        };

        if (isCreate) {
            return await services.createRoleTag({
                input,
            });
        } else {
            return await services.updateRoleTag({
                input,
                id: Number(id),
            });
        }
    };

    return (
        <ClassicDrawer
            title={isCreate ? t('RoleTag.Create') : t('RoleTag.Edit')}
            onSubmit={handleSubmit}
            childrenWrapperStyle={{ padding: 0 }}
            disableButtonSubmit={isEmpty(roleTagName) || !confirmExit}
            confirmExit={confirmExit}
        >
            {!loading ? (
                <DataForm
                    onUpdate={(data) => {
                        if (!isEmpty(data)) {
                            setConfirmExit(true);

                            if (data?.roleTagName) {
                                setIsChangeName(true);
                                setRoleTagName(data.roleTagName);
                            }
                            data?.roleTagDescription && setRoleTagDescription(data.roleTagDescription);
                            data?.roleIds && setRoleIds(data.roleIds);
                        }
                    }}
                    oldValue={{
                        roleTagName,
                        roleTagDescription,
                        roleIds,
                    }}
                    fields={[
                        {
                            fieldName: 'roleTagName',
                            type: FIELD_TYPE.TEXT,
                            label: t('RoleTag.Name'),
                            required: true,
                            error: isCreate && isChangeName && !valid,
                            helperText: isCreate && isChangeName && message,
                        },
                        {
                            fieldName: 'roleTagDescription',
                            type: FIELD_TYPE.TEXT,
                            label: t('RoleTag.Description'),
                        },
                        {
                            fieldName: 'roleIds',
                            type: FIELD_TYPE.AUTOCOMPLETE,
                            multiple: true,
                            label: t('RoleTag.Roles'),
                            options: roleOptions,
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
