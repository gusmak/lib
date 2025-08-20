import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ClassicDrawer } from 'Commons/Components';
import { FIELD_TYPE, FieldDefinitionProps } from 'AWING/DataInput';
import { CircularProgress, DataForm } from 'AWING';
import type { DirectoryProps, DirectoryForm } from './types';

const CreateDirectory = (props: DirectoryProps) => {
    const { isCreate = false, onUpdateDirectories, onDrawerClose, ...service } = props;
    const { t } = useTranslation();
    const { directoryId } = useParams<'directoryId'>();
    const parentDirectoryId = Number(directoryId || 0);

    const [directory, setDirectory] = useState<DirectoryForm | undefined>(undefined);
    const [readyForSubmit, setReadyForSubmit] = useState<boolean>(false);
    const [confirmExit, setConfirmExit] = useState(false);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        service.getDirectoryById({ id: parentDirectoryId }).then((data) => {
            setloading(false);

            let currentDirectory: DirectoryForm = {
                name: '',
                description: '',
                order: 0,
                parentName: data.name ?? '',
                parentDirectoryId,
            };

            if (!isCreate) {
                currentDirectory = {
                    name: data.name ?? '',
                    description: data.description ?? '',
                    order: data.order ?? 0,
                    parentName: data.name ?? '',
                    parentDirectoryId,
                };
            }

            setDirectory(currentDirectory);
        });
    }, []);

    const handleUpdate = useCallback(
        (obj: DirectoryForm, valid: boolean, fieldUpdate: string) => {
            setConfirmExit(Boolean(fieldUpdate));
            setDirectory((old) => ({ ...old, ...obj }));

            let isReadyForSubmit = valid && !!obj?.name;
            if (!isCreate) {
                /** Edit */
                isReadyForSubmit = valid && !!directory?.name && Boolean(fieldUpdate);
            }

            setReadyForSubmit(isReadyForSubmit);
        },
        [directory?.name]
    );

    const handleSubmit = async () => {
        if (isCreate) {
            return await service
                .createDirectory({
                    input: {
                        directory: {
                            name: directory?.name,
                            description: directory?.description,
                        },
                        parentDirectoryId,
                    },
                })
                .then(() => onUpdateDirectories(parentDirectoryId));
        } else {
            return await service
                .updateDirectory({
                    input: {
                        directory: {
                            name: directory?.name,
                            description: directory?.description,
                        }
                    },
                    id: parentDirectoryId,
                })
                .then(() => onUpdateDirectories(parentDirectoryId));
        }
    };

    const fields: FieldDefinitionProps[] = [
        {
            fieldName: 'name',
            type: FIELD_TYPE.TEXT,
            length: 200,
            label: t('DirectoryManagement.DirectoryName'),
            required: true,
        },
        {
            fieldName: 'description',
            length: 500,
            type: FIELD_TYPE.TEXT_AREA,
            label: t('DirectoryManagement.Description'),
        },
    ];

    if (isCreate) {
        const parentDirectoryId: FieldDefinitionProps = {
            type: FIELD_TYPE.TEXT,
            fieldName: 'parentName',
            label: t('DirectoryManagement.ParentDirectory'),
            disabled: true,
        };

        fields.unshift(parentDirectoryId);
    }

    return (
        <ClassicDrawer
            title={isCreate ? t('DirectoryManagement.CreateDirectory') : t('DirectoryManagement.EditDirectory')}
            onSubmit={handleSubmit}
            disableButtonSubmit={!readyForSubmit}
            confirmExit={confirmExit}
            childrenWrapperStyle={{ padding: 0 }}
            onClose={() => onDrawerClose && onDrawerClose()}
        >
            {loading ? <CircularProgress /> : <DataForm onUpdate={handleUpdate} fields={fields} oldValue={directory} />}
        </ClassicDrawer>
    );
};

export default CreateDirectory;
