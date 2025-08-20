import { textValidation } from 'AWING';
import { ClassicDrawer } from 'Commons';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import {
    confirmExitState,
    currentSchemaDetailsState,
    nameState,
    objectTypeCodeState,
    resetAllState,
    rootSchemasState,
    schemaState,
    selectedRootSchemaState,
} from './Atoms';
import { Workspaces } from 'Commons/Constant';
import TabConfigtion from './components/TabConfigtion';
import { useGetSchemaContext } from './context';
import type { CurrentSchemaDetail } from './types';
import { getSchemaInput } from './utils';

export type CreateSchemaProps = {
    onUpdateSchemas?: () => void;
    drawerLevel?: number;
    onDrawerLevelChange?: (level: number) => void;
};

const AddOrEdit = (props: CreateSchemaProps) => {
    const { t } = useTranslation();
    const { chemaId } = useParams<'chemaId'>();
    const isCreate = !Number(chemaId);

    const { drawerLevel, onUpdateSchemas, onDrawerLevelChange } = props;
    const { services, currentWorkspace } = useGetSchemaContext();

    /** Jotai */
    const [name, setName] = useAtom(nameState);
    const [schema, setSchema] = useAtom(schemaState);
    const [objectTypeCode, setObjectTypeCode] = useAtom(objectTypeCodeState);
    const [currentSchemaDetails, setCurrentSchemaDetails] = useAtom(currentSchemaDetailsState);
    const setSelectedRootSchema = useSetAtom(selectedRootSchemaState);

    const rootSchemas = useAtomValue(rootSchemasState);
    const confirmExit = useAtomValue(confirmExitState);
    /** Reset Jotai state */
    const getResetAllState = useSetAtom(resetAllState);

    const [loadingCreateSchema, setLoadingCreateSchema] = useState<boolean>(false);
    const [oldSchemaDetails, setOldSchemaDetails] = useState<CurrentSchemaDetail[]>([]);

    /** Edit */
    useEffect(() => {
        if (!isCreate && services) {
            services
                .getSchemaById({
                    id: Number(chemaId),
                })
                .then((schema) => {
                    setSchema(schema);
                    schema.name && setName(schema.name);
                    schema.objectTypeCode && setObjectTypeCode(schema.objectTypeCode);

                    /** Tìm rootSchema của schema đang sửa */
                    const rootSchemasByObject = rootSchemas.find((item) => item.objectTypeCode === schema.objectTypeCode);
                    rootSchemasByObject && setSelectedRootSchema(rootSchemasByObject);

                    if (schema.schemaObjectDefinitions) {
                        const detail: CurrentSchemaDetail[] = schema.schemaObjectDefinitions.map((i) => ({
                            objectDefinitionId: i.objectDefinitionId,
                            objectDefinition: i.objectDefinition,
                            isReadOnly: !!i.isReadOnly,
                            id: i.id,
                        }));

                        setCurrentSchemaDetails(detail);
                        setOldSchemaDetails(detail);
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chemaId]);

    const handleComplete = () => {
        setLoadingCreateSchema(false);
        drawerLevel && onDrawerLevelChange && onDrawerLevelChange(drawerLevel - 1);
        onUpdateSchemas && onUpdateSchemas();
    };

    const handleSubmit = async () => {
        setLoadingCreateSchema(true);
        if (services) {
            if (isCreate) {
                return await services
                    .createSchema({
                        input: {
                            name: name,
                            objectTypeCode: objectTypeCode,
                            schemaObjectDefinitions: currentSchemaDetails?.map((x) => {
                                return {
                                    value: {
                                        objectDefinitionId: x?.objectDefinitionId,
                                        isReadOnly: x?.isReadOnly,
                                    },
                                };
                            }),
                        },
                    })
                    .then(() => {
                        handleComplete();
                    });
            } else {
                return await services
                    .updateSchema({
                        input: {
                            name: name,
                            objectTypeCode: objectTypeCode,
                            schemaObjectDefinitions: getSchemaInput(currentSchemaDetails, oldSchemaDetails),
                        },
                        id: Number(schema?.id),
                    })
                    .then(() => {
                        handleComplete();
                    });
            }
        }
    };

    const disableButtonSubmit = useMemo(() => {
        const nameValid = name && textValidation(name, 200).valid;
        const isRootSchemaAdmin = currentWorkspace?.type === Workspaces.ADMIN ? true : rootSchemas?.length;

        if (isCreate) return !(nameValid && currentSchemaDetails.length && isRootSchemaAdmin && objectTypeCode !== '');

        return !confirmExit && !(nameValid && name !== schema?.name);
    }, [name, currentSchemaDetails, schema, confirmExit]);

    const handleClose = () => {
        drawerLevel && onDrawerLevelChange && onDrawerLevelChange(drawerLevel - 1);
        getResetAllState();
    };

    return (
        <ClassicDrawer
            title={isCreate ? t('Schema.TitleCreateSchema') : t('Schema.TitleEditSchema')}
            onSubmit={handleSubmit}
            isLoadingButtonSubmit={loadingCreateSchema}
            disableButtonSubmit={disableButtonSubmit}
            confirmExit={confirmExit}
            onClose={handleClose}
            childrenWrapperStyle={{ padding: 0 }}
        >
            <TabConfigtion />
        </ClassicDrawer>
    );
};
export default AddOrEdit;
