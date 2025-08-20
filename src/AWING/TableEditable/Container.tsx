import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cloneDeep, omit } from 'lodash';
import { Add as AddIcon } from '@mui/icons-material';
import { Button, Paper, Table, TableContainer } from '@mui/material';
import { calculateValue, convertFormulaToBinaryTree, replaceFieldsValue } from '../helper';
import type { TableEditableProps } from './interface';
import TableEditableBody from './components/TableEditableBody';
import TableHeader from './components/TableHeader';
import TopBarActions from './components/TopBarActions';

export default function TableEditable<T>(props: TableEditableProps<T>) {
    const { t } = useTranslation();
    const {
        columnDefinitions,
        items,
        onChange,
        getRowId,
        selected,
        onSelectedChange,
        hideHeader = false,
        onAddNew,
        includeDelete = false,
        spanningRows,
        selectionActions,
        mergeRowsBy,
    } = props;

    const [dataValidation, setDataValidation] = useState<Partial<{ [K in keyof T]: boolean }>[]>(items.map(() => ({})));

    useEffect(() => {
        const difference = items.length - dataValidation.length;
        if (difference > 0) {
            let newDataValidation = cloneDeep(dataValidation);
            for (let i = 0; i < difference; i++) {
                newDataValidation.push({});
            }
            setDataValidation(newDataValidation);
        }
    }, [items]);

    const handleChange = (indexes: number[], fieldName: keyof T, newValue: T[keyof T], valid: boolean) => {
        let newData = cloneDeep(items);
        let newValidation: Partial<{ [K in keyof T]: boolean }>[] = cloneDeep(dataValidation);

        indexes.map((indexOfArray) => {
            newData[indexOfArray][fieldName] = newValue;

            newValidation[indexOfArray][fieldName] = valid;

            let field = columnDefinitions.find(
                (x) => x.editFieldDefinition?.fieldName === fieldName
            )?.editFieldDefinition;
            if (field) {
                if (field.customeFieldChange) {
                    const objChange = field.customeFieldChange(newValue);
                    if (typeof objChange === 'object' && objChange !== null) {
                        newData[indexOfArray] = {
                            ...newData[indexOfArray],
                            ...objChange,
                        };
                        for (let fieldKey in objChange) {
                            newValidation[indexOfArray][fieldKey as keyof T] = true;
                        }
                    }
                }
                const convertFields = columnDefinitions
                    .filter((col) => col.editFieldDefinition && col.editFieldDefinition.fieldName)
                    .map((col) => ({
                        fieldName: String(col.editFieldDefinition!.fieldName!),
                        value: String(newData[indexOfArray][col.editFieldDefinition!.fieldName as keyof T] ?? ''),
                    }));
                const convertFormulas = columnDefinitions
                    .filter(
                        (col) =>
                            !!col.editFieldDefinition &&
                            !!col.editFieldDefinition.autoFormula &&
                            col.editFieldDefinition.fieldName
                    )
                    .map((col) => ({
                        fieldName: String(col.editFieldDefinition!.fieldName!),
                        value: col.editFieldDefinition?.autoFormula,
                    }));
                const currentField = field;
                const relateFormulas = convertFormulas.filter((formula) =>
                    formula?.value?.includes(`{${currentField?.fieldName?.toString()}}`)
                );
                if (relateFormulas.length > 0) {
                    const result = updateFieldsWithFormulas(
                        convertFormulas,
                        convertFields,
                        newData[indexOfArray],
                        newValidation[indexOfArray],
                        relateFormulas
                    );
                    newData[indexOfArray] = result.newData;
                    newValidation[indexOfArray] = result.newValidation;
                }
            }
        });
        const dataValid = getDataValidation(newData, newValidation);
        if (mergeRowsBy) {
            newData = omit(newData, 'originalId');
        }
        onChange(newData, dataValid);
        setDataValidation(newValidation);
    };

    const updateFieldsWithFormulas = (
        convertFormulas: { fieldName: string; value: string | undefined }[],
        convertFields: Array<{ fieldName: string; value: string }>,
        newValue: Partial<T>,
        validation: Partial<{ [K in keyof T]: boolean }>,
        relateFormulas: { fieldName: string; value: string | undefined }[]
    ) => {
        const newData: Partial<T> = Object.assign({}, newValue);
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
                        newData[currentStack?.fieldName as keyof T] = result.toString() as unknown as T[keyof T];
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
        return { newData, newValidation };
    };

    const handleDelete = (indexOfArray: number) => {
        const newData = cloneDeep(items);
        const itemDeleted = newData[indexOfArray];
        newData.splice(indexOfArray, 1);

        const newValidation = cloneDeep(dataValidation);
        newValidation.splice(indexOfArray, 1);

        const dataValid = getDataValidation(newData, newValidation);
        if (selected?.includes((itemDeleted as Partial<T> & { id: number }).id))
            handleSelect((itemDeleted as Partial<T> & { id: number }).id);
        onChange(newData, dataValid);
        setDataValidation(newValidation);
    };

    const getDataValidation = <T,>(data: Partial<T>[], validation: Partial<{ [K in keyof T]: boolean }>[]) => {
        let dataValid = validation.every((validation) =>
            Object.keys(validation).every((key) => validation[key as keyof T])
        );
        if (dataValid) {
            data.forEach((item) => {
                columnDefinitions
                    .filter((x) => x.editFieldDefinition && x.editFieldDefinition.required)
                    .forEach((fieldDef) => {
                        if (
                            dataValid &&
                            fieldDef.editFieldDefinition &&
                            item[fieldDef.editFieldDefinition.fieldName as unknown as keyof T] == undefined
                        )
                            dataValid = false;
                    });
            });
        }
        return dataValid;
    };

    const getId = (row: Partial<T>) => {
        if (getRowId) {
            return getRowId(row);
        } else if (row.hasOwnProperty('id')) {
            return 'id' in row ? (row['id'] as string | number | undefined) : undefined;
        } else {
            return undefined;
        }
    };

    const handleSelectAll = () => {
        if (selected && onSelectedChange) {
            if (selected.length > 0) {
                onSelectedChange([]);
            } else {
                onSelectedChange(items?.map((r, index) => (getId(r) !== undefined ? getId(r) : index)) as number[]);
            }
        }
    };

    const handleSelect = (id: number) => {
        if (selected && onSelectedChange) {
            if (selected.includes(id)) {
                onSelectedChange(selected.filter((x) => x !== id));
            } else {
                let newSelected = selected.slice();
                newSelected.push(id);
                onSelectedChange(newSelected);
            }
        }
    };

    return (
        <>
            <TableContainer component={Paper}>
                {selected && onSelectedChange && selected.length > 0 && selectionActions && (
                    <TopBarActions selected={selected} selectionActions={selectionActions} />
                )}
                <Table aria-label="table editable">
                    {!hideHeader && (
                        <TableHeader
                            selected={selected}
                            onSelectedChange={onSelectedChange}
                            numOfRows={items.length}
                            onSelectAll={handleSelectAll}
                            includeDelete={includeDelete}
                            columnDefinitions={columnDefinitions}
                        />
                    )}
                    <TableEditableBody
                        items={items}
                        getId={getId}
                        selected={selected}
                        onSelectedChange={onSelectedChange}
                        onSelect={handleSelect}
                        columnDefinitions={columnDefinitions}
                        dataValidation={dataValidation}
                        includeDelete={includeDelete}
                        spanningRows={spanningRows}
                        onChange={handleChange}
                        onDelete={handleDelete}
                        mergeRowsBy={mergeRowsBy}
                    />
                </Table>
            </TableContainer>
            {onAddNew && (
                <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => onAddNew()}>
                    {t('Common.Create')}
                </Button>
            )}
        </>
    );
}
