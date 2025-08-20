import { PageManagement, QueryInput } from 'AWING';
import { SortEnumType } from 'Commons/Enums';
import { useAppHelper } from 'Context';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useNavigate } from 'react-router';
import { Constants as CommonConstants } from 'Commons/Constant';
import AddOrEdit from './AddOrEdit';
import { fullFieldsState, objectTypeCodesState, resetAllState, rootSchemasState } from './Atoms';
import { Constants } from './Constants';
import SchemaViewOnly from './components/SchemaViewOnly';
import { useGetSchemaContext } from './context';
import type { Schema, SortInput } from './types';
import { getObjectTypeCodes } from './utils';

const SchemaContainer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { confirm, snackbar } = useAppHelper();
    const { currentWorkspace, services } = useGetSchemaContext();

    /** Jotai */
    const [fullFields, setFullFields] = useAtom(fullFieldsState);
    const [objectTypeCodes, setObjectTypeCodes] = useAtom(objectTypeCodesState);
    const [rootSchemas, setRootSchemas] = useAtom(rootSchemasState);
    const getResetAllState = useSetAtom(resetAllState);

    /** For Filter */
    const [isUpdateSchemas, setIsUpdateSchemas] = useState<boolean>(false);
    const [objectTypeCode, setObjectTypeCode] = useState<string>('');
    const [schemas, setSchemas] = useState<Schema[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [pickToEditSchema, setPickToEditSchema] = useState<Schema | undefined>(undefined);

    const queryInputMemo = useRef<QueryInput>({
        pageIndex: 0,
        pageSize: CommonConstants.PAGE_SIZE_DEFAULT,
    });

    const queryData = useCallback(
        (queryInput: QueryInput) => {
            if (currentWorkspace?.id) {
                queryInputMemo.current = queryInput;
                let sorts: SortInput[] = [];
                queryInput.sortModel?.forEach((model) => {
                    sorts.push({
                        [model.field]: model.sort === 'asc' ? SortEnumType.Asc : SortEnumType.Desc,
                    });
                });
                if (sorts.length <= 0) sorts = [{ id: SortEnumType.Desc }];
                const objectTypeCodeNew = (queryInput.advancedObject as { objectTypeCode?: string })?.objectTypeCode ?? '';
                setObjectTypeCode(objectTypeCodeNew);

                if (services)
                    services
                        .getSchemas({
                            where: {
                                ...(objectTypeCodeNew && {
                                    objectTypeCode: {
                                        eq: objectTypeCodeNew,
                                    },
                                }),
                                ...(queryInput.searchString && {
                                    name: {
                                        contains: queryInput.searchString.trim(),
                                    },
                                }),
                                ...(currentWorkspace?.id && {
                                    workspaceId: {
                                        eq: currentWorkspace?.id,
                                    },
                                }),
                            },
                            order: sorts,
                            skip: queryInput.pageSize && queryInput.pageIndex ? queryInput.pageSize * queryInput.pageIndex : 0,
                            take: queryInput.pageSize ?? CommonConstants.PAGE_SIZE_DEFAULT,
                        })
                        .then((data) => {
                            setLoading(false);
                            if (data) {
                                setSchemas(data.items);
                                setTotalCount(data.total);
                            }
                        });
            }
        },
        [currentWorkspace, isUpdateSchemas, services?.getSchemas]
    );

    /** Danh sách schema gồm root và schemas */
    const rows = [...rootSchemas.map((root) => ({ ...root, isRoot: true })), ...schemas];

    const handleRowClick = (id: number) => {
        const picked = rows.find((item) => item.id === id);

        getResetAllState();
        setPickToEditSchema(picked);
        navigate(`${picked?.isRoot ? Constants.VIEW_PATH : Constants.EDIT_PATH}/${id}`);
    };

    /** Update Schema callback */
    const handleUpdateSchemas = () => {
        setIsUpdateSchemas(!isUpdateSchemas);
    };

    /** Delete */
    const handleDelete = async (id: number) => {
        if (services)
            return await services.deleteSchema({ id }).then(() => {
                /** Sau khi xoá, render lại danh sách */
                queryData(queryInputMemo.current);
            });
    };

    useEffect(() => {
        if (services) {
            services
                .getObjectDefinitions({
                    where: objectTypeCode ? { objectTypeCode: { eq: objectTypeCode } } : {},
                    order: [{ fieldPath: SortEnumType.Asc }],
                })
                .then((data) => {
                    const objectDefinitions = data.items;

                    /** Danh sách toàn bộ field/ */
                    setFullFields(objectDefinitions);

                    // Lấy toàn bộ ObjectTypeCodes thông qua ObjectDefinitions
                    setObjectTypeCodes(getObjectTypeCodes(objectDefinitions));
                });
        }
    }, [objectTypeCode]);

    useEffect(() => {
        const defaultSchemas = currentWorkspace?.defaultSchemas;
        if (defaultSchemas) {
            const rootSchemas = defaultSchemas.filter((s) => {
                /** Nếu có objectTypeCode */
                if (objectTypeCode) return s.objectTypeCode === objectTypeCode;
                else return s;
            });

            /** Danh sách schema root thông qua current workspace */
            setRootSchemas(rootSchemas);
        }
    }, [currentWorkspace?.defaultSchemas]);

    const handleCreateButtonClick = () => {
        getResetAllState();
        navigate(Constants.CREATE_PATH);
    };

    return (
        <>
            <PageManagement
                title={t('Schema.Title')}
                onChangeQueryInput={queryData}
                loading={loading}
                columns={[
                    {
                        field: 'id',
                        headerName: 'ID',
                        sortable: true,
                        width: '100px',
                    },
                    {
                        field: 'name',
                        headerName: t('Schema.Name'),
                        sortable: true,
                        type: 'text',
                        valueGetter: (row) => `${row.name}${row?.isRoot ? ' (Root)' : ''}`,
                        TableCellProps: {
                            sx: {
                                wordBreak: 'break-word',
                            },
                        },
                    },
                    {
                        field: 'objectTypeCode',
                        headerName: t('Schema.ObjectTypeCode'),
                    },
                ]}
                onCreateButtonClick={handleCreateButtonClick}
                rows={rows}
                confirmDelete={confirm}
                getRowId={(row) => row?.id ?? 0}
                onRowClick={handleRowClick}
                totalOfRows={totalCount}
                showNotificationSuccess={() => snackbar('success')}
                onDelete={(id) => handleDelete(Number(id))}
                advancedSearchFields={[
                    {
                        fieldName: 'objectTypeCode',
                        label: t('Schema.ObjectLabel'),
                        type: 'autocomplete',
                        options: objectTypeCodes.map((o) => ({
                            value: o.key,
                            text: o.key,
                        })),
                    },
                ]}
            />
            <Routes>
                <Route
                    key={Constants.CREATE_PATH}
                    path={Constants.CREATE_PATH}
                    element={<AddOrEdit onUpdateSchemas={handleUpdateSchemas} />}
                />
                <Route
                    key={Constants.EDIT_PATH}
                    path={`${Constants.EDIT_PATH}/:chemaId`}
                    element={<AddOrEdit onUpdateSchemas={handleUpdateSchemas} />}
                />
                <Route
                    key={Constants.VIEW_PATH}
                    path={`${Constants.VIEW_PATH}/:chemaId`}
                    element={<SchemaViewOnly objectTypeDetail={fullFields} schema={pickToEditSchema!} rows={rows} />}
                />
            </Routes>
        </>
    );
};

export default SchemaContainer;
