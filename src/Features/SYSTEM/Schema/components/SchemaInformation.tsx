import { MenuItem, TextField, Typography } from '@mui/material';
import { textValidation } from 'AWING';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    confirmExitState,
    currentSchemaDetailsState,
    fullFieldsState,
    nameState,
    objectTypeCodesState,
    objectTypeCodeState,
    rootSchemaObjectsState,
    rootSchemasState,
    schemaState,
    selectedRootSchemaState,
} from '../Atoms';
import type { ConvertObjectDefinition, FieldChild } from '../types';
import { convertToDisplayData, convertToTreeData } from '../utils';
import ObjectFields from './ObjectFields';

const SchemaInformation = () => {
    const { t } = useTranslation();

    /** Jotai */
    const fullFields = useAtomValue(fullFieldsState);
    const objectTypeCodes = useAtomValue(objectTypeCodesState);
    const schema = useAtomValue(schemaState);
    const rootSchemas = useAtomValue(rootSchemasState);
    const [name, setName] = useAtom(nameState);
    const [objectTypeCode, setObjectTypeCode] = useAtom(objectTypeCodeState);
    const [currentSchemaDetails, setCurrentSchemaDetails] = useAtom(currentSchemaDetailsState);
    const [rootSchemaObjects, setRootSchemaObjects] = useAtom(rootSchemaObjectsState);
    const [selectedRootSchema, setSelectedRootSchema] = useAtom(selectedRootSchemaState);
    const setConfirmExit = useSetAtom(confirmExitState);

    /** check is create new schema */
    const isCreate = !schema?.id;
    // const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
    const [isChangeName, setIsChangeName] = useState<boolean>(false);
    const [displayFields, setDisplayFields] = useState<ConvertObjectDefinition[]>([]);

    /** Changed object type code */
    const handleChangeObjectTypeCode = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target?.value;
        setObjectTypeCode(value);

        const rootSchemasByObject = rootSchemas.filter((item) => item.objectTypeCode === value);

        setRootSchemaObjects(rootSchemasByObject);
        setSelectedRootSchema(rootSchemasByObject.length ? rootSchemasByObject[0] : {});
        isCreate && setConfirmExit(true);
    };

    /** Changed schema name */
    const handleChangeSchemaName = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target?.value);
        setConfirmExit(true);
        !isChangeName && setIsChangeName(true);
    };

    const { valid, message } = textValidation(name, 200);

    useEffect(() => {
        /** Create: Set id (isPrimaryKey), whenever has checked */
        let tmpPkField = displayFields.find((o) => o.isPrimaryKey);
        if (
            isCreate &&
            tmpPkField &&
            currentSchemaDetails &&
            (!currentSchemaDetails.length ||
                (currentSchemaDetails.length && !currentSchemaDetails.find((c) => c.objectDefinitionId === tmpPkField?.id)))
        ) {
            const currentPK: FieldChild = {
                objectDefinitionId: tmpPkField.id,
                objectDefinition: tmpPkField,
                isReadOnly: !!tmpPkField.isReadOnly,
            };

            setCurrentSchemaDetails([currentPK]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCreate, displayFields]);

    useEffect(() => {
        const fields = fullFields.filter((o) => o.objectTypeCode === objectTypeCode);

        /** convert data fields to tree */
        let tmpDisplayData = convertToTreeData(convertToDisplayData(fields, selectedRootSchema));
        let tmpPkField = tmpDisplayData.find((o) => !!o.isPrimaryKey);

        if (tmpPkField) {
            tmpDisplayData = tmpDisplayData.filter((o) => !o.isPrimaryKey);
            tmpDisplayData = [{ ...tmpPkField, isDisable: true }, ...tmpDisplayData];
        }

        setDisplayFields(tmpDisplayData);
    }, [selectedRootSchema, fullFields, objectTypeCode]);

    return (
        <>
            <TextField
                autoFocus
                label={t('Schema.ObjectLabel')}
                select
                value={objectTypeCode}
                onChange={handleChangeObjectTypeCode}
                required={true}
                variant="standard"
                fullWidth
                disabled={!isCreate}
                data-testid="objectTypeCode"
            >
                {objectTypeCodes.map((option) => (
                    <MenuItem key={option.key} value={option.key}>
                        {option.key}
                    </MenuItem>
                ))}
            </TextField>
            {rootSchemaObjects?.length ? (
                <TextField
                    select
                    variant="standard"
                    label={t('Schema.RootSchema')}
                    value={Number(selectedRootSchema?.id)}
                    fullWidth
                    data-testid="rootSchemaObjects"
                    onChange={(e) => {
                        const newSelect = rootSchemaObjects.find((r) => r.id === Number(e.target?.value));
                        newSelect && setSelectedRootSchema(newSelect);
                    }}
                >
                    {rootSchemaObjects.map((item) => {
                        return (
                            <MenuItem key={item.id} value={item.id}>
                                {item.name + ' (' + item.objectTypeCode + ')'}
                            </MenuItem>
                        );
                    })}
                </TextField>
            ) : null}
            <TextField
                fullWidth
                variant="standard"
                label={t('Schema.Name')}
                required
                onChange={handleChangeSchemaName}
                value={name}
                error={isChangeName && !valid}
                helperText={isChangeName && message}
                data-testid="SchemaName"
            />
            <Typography sx={{ fontWeight: 'bold', pt: 2, pb: 2 }}>{`${t('Schema.FieldLabel')} *`}</Typography>

            {/* Fields */}
            <ObjectFields displayFields={displayFields} />
        </>
    );
};

export default SchemaInformation;
