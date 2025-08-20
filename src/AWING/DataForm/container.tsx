import { useEffect, useRef, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import InputFactory from 'AWING/DataInput';
import { FieldDefinitionProps } from 'AWING/DataInput/interfaces';
import { calculateValue, convertFormulaToBinaryTree, replaceFieldsValue } from '../helper';
import { type DataFormProps } from './interface';
import { keysIn } from 'lodash';

export default function DataForm<T extends object>(props: DataFormProps<T>) {
    const { caption, actions, fields, onUpdate, padding = 'normal', onValidateForm } = props;

    const [oldValue, setOldValue] = useState<Partial<T> | undefined>(undefined);
    const [keyUpdate, setKey] = useState<string>('');
    const isFirstRender = useRef(true);
    const [dataFormState, setDataFormState] = useState<{
        fieldsToUpdate: Partial<T>;
        validation: Partial<{ [K in keyof T]: boolean }>;
    }>(() => {
        const fieldsToUpdate: Partial<T> = {};
        const validation: Partial<{ [K in keyof T]: boolean }> = {};
        fields.forEach((fieldDef) => {
            const fieldName = fieldDef.fieldName as keyof T;
            if (fieldDef.defaultValue !== undefined && (oldValue === undefined || oldValue[fieldName] === undefined)) {
                fieldsToUpdate[fieldName] = fieldDef.defaultValue as T[keyof T];
                validation[fieldName] = true;
            }
        });
        return {
            fieldsToUpdate: fieldsToUpdate,
            validation: validation,
        };
    });

    useEffect(() => {
        const o = { ...oldValue } as any;
        fields.map((fieldDef) => {
            const fieldName = fieldDef.fieldName as keyof T;

            if (props?.oldValue?.[fieldName] !== oldValue?.[fieldName]) {
                o[fieldName] = props?.oldValue?.[fieldName];
            }
        });

        if (keysIn(o).length) {
            setOldValue(o);
        }
    }, [props?.oldValue, fields]);

    const handleChange = (fieldName: keyof T, newValue: T[keyof T], valid: boolean) => {
        setDataFormState((pre) => {
            let newFieldsToUpdate = { ...pre.fieldsToUpdate };
            let newValidation = { ...pre.validation };

            if (oldValue && oldValue[fieldName] === newValue) {
                delete newFieldsToUpdate[fieldName];
            } else if (newFieldsToUpdate[fieldName] !== newValue) {
                newFieldsToUpdate[fieldName] = newValue;
            }
            newValidation[fieldName] = valid;

            let field = fields.find((x) => x.fieldName === fieldName);
            if (field) {
                if (field.customeFieldChange) {
                    const objChange = field.customeFieldChange(newValue);
                    if (typeof objChange === 'object' && objChange !== null) {
                        newFieldsToUpdate = {
                            ...newFieldsToUpdate,
                            ...objChange,
                        };
                        for (let fieldKey in objChange) {
                            newValidation[fieldKey as unknown as keyof T] = true;
                        }
                    }
                }
            }
            const convertFields: { fieldName: string; value: string }[] = fields.map((field) => {
                return {
                    fieldName: String(field.fieldName),
                    value: String(
                        newFieldsToUpdate[field.fieldName as keyof T] ?? oldValue?.[field.fieldName as keyof T] ?? ''
                    ),
                };
            });

            const convertFormulas = fields
                .filter((field) => field.autoFormula)
                .map((field) => ({
                    fieldName: String(field.fieldName ?? ''),
                    value: field.autoFormula,
                }));

            const currentField = convertFields.find((field) => field.fieldName === fieldName);
            let result = {
                fieldsToUpdate: newFieldsToUpdate,
                validation: newValidation,
            };
            if (currentField) {
                const relateFormulas = convertFormulas.filter((formula) =>
                    formula?.value?.includes(`{${currentField.fieldName?.toString()}}`)
                );
                if (relateFormulas.length > 0) {
                    result = updateFieldsWithFormulas(
                        convertFormulas,
                        convertFields,
                        newFieldsToUpdate,
                        newValidation,
                        relateFormulas
                    );
                }
            }
            return result;
        });
        setKey(String(fieldName));
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // Bỏ qua lần chạy đầu tiên
        }
        if (onUpdate) {
            let formValid = Object.keys(dataFormState.validation).every(
                (key) => dataFormState.validation[key as keyof T]
            );

            if (formValid) {
                fields
                    .filter((x) => x?.required)
                    .forEach((fieldDef) => {
                        if (
                            dataFormState.fieldsToUpdate[fieldDef.fieldName as keyof T] &&
                            oldValue?.[fieldDef.fieldName as keyof T]
                        )
                            formValid = true;
                    });
            }
            if (onValidateForm && formValid) {
                formValid = onValidateForm({
                    ...oldValue,
                    ...dataFormState.fieldsToUpdate,
                });
            }

            onUpdate(dataFormState.fieldsToUpdate, formValid, keyUpdate as keyof T);
        }
    }, [dataFormState, keyUpdate]);

    const updateFieldsWithFormulas = (
        convertFormulas: { fieldName: string; value: string | undefined }[],
        convertFields: Array<{ fieldName: string; value: string }>,
        newValue: Partial<T>,
        validation: Partial<{ [K in keyof T]: boolean }>,
        relateFormulas: { fieldName: string; value: string | undefined }[]
    ) => {
        const newFieldsToUpdate: Partial<T> = Object.assign({}, newValue);
        const newValidation: Partial<{ [K in keyof T]: boolean }> = Object.assign({}, validation);
        const newFields: Array<{ fieldName: string; value: string }> = Object.assign([], convertFields);
        relateFormulas.map((formula) => {
            let stack = [formula];
            while (stack.length > 0) {
                const currentStack = stack.shift();
                const replaceValue = replaceFieldsValue(newFields, currentStack?.value ?? '');
                if (!replaceValue.includes('notready')) {
                    const binaryTree = convertFormulaToBinaryTree(replaceValue);
                    if (binaryTree) {
                        const result = calculateValue(binaryTree);
                        const fieldIndex = newFields.findIndex((field) => field.fieldName === currentStack?.fieldName);
                        newFields[fieldIndex].value = result.toString();
                        newFieldsToUpdate[currentStack?.fieldName as keyof T] = result as unknown as T[keyof T];
                        newValidation[currentStack?.fieldName as keyof T] = true;
                        const relateField = newFields[fieldIndex];
                        const relateAgains = convertFormulas.filter((formula) =>
                            formula?.value?.includes(relateField.fieldName)
                        );
                        stack.push(...relateAgains);
                    }
                }
            }
        });
        return { fieldsToUpdate: newFieldsToUpdate, validation: newValidation };
    };

    return (
        <Grid container sx={{ flexGrow: 1, padding: (theme) => theme.spacing(3) }}>
            <Grid
                size={{
                    xs: 12,
                }}
                {...(padding === 'normal' && {
                    component: Paper,
                    sx: { p: 3 },
                })}
            >
                {(caption || actions) && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {caption && (
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                {caption}
                            </Typography>
                        )}
                        {actions && (
                            <Box
                                sx={{
                                    margin: (theme) => theme.spacing(1),
                                    position: 'relative',
                                }}
                            >
                                {actions}
                            </Box>
                        )}
                    </Box>
                )}
                <Grid container spacing={2}>
                    {fields.map((fieldDef) => {
                        const { fieldName, value } = fieldDef;

                        const fieldValue: FieldDefinitionProps<T>['value'] =
                            dataFormState.fieldsToUpdate[fieldName as keyof T] ??
                            (oldValue ? oldValue[fieldName as keyof T] : value);

                        const showError =
                            dataFormState.validation[fieldName as keyof T] !== undefined
                                ? !dataFormState.validation[fieldName as keyof T]
                                : undefined;

                        return (
                            <Grid
                                key={fieldName}
                                size={{
                                    xs: fieldDef.gridSize || 12,
                                }}
                            >
                                <InputFactory
                                    key={fieldName}
                                    {...fieldDef}
                                    value={fieldValue as any}
                                    onChange={(newValue: any, valid: any) =>
                                        handleChange(fieldName as keyof T, newValue as T[keyof T], valid as boolean)
                                    }
                                    error={showError}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        </Grid>
    );
}
