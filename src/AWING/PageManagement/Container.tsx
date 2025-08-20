import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { cloneDeep, debounce, isEqual } from 'lodash';
import { CreateNewFolderOutlined, Delete as DeleteIcon } from '@mui/icons-material';
import { Button } from '@mui/material';
import { CloseAction } from 'Commons/Components/Drawer';
import { Constants } from 'Commons/Constant';
import AdvancedSearch from 'AWING/AdvancedSearch';
import CircularProgress from 'AWING/CircularProgress';
import DataGrid, { RowId } from 'AWING/DataGrid';
import Page from 'AWING/Page';
import SearchBox from 'AWING/SearchBox';
import { getAdvanceSearchValue } from './utils';
import type { PageManagementProps, QueryInput } from './interface';

function PageManagement<T>(props: PageManagementProps<T>) {
    const { t } = useTranslation();
    const location = useLocation();
    const {
        title,
        columns,
        rows,
        totalOfRows = rows?.length,
        getRowId,
        checkboxSelection,
        onDeleteSelected,
        advancedSearchFields,
        onlyNumberString,
        disableSearch = false,
        includeSearchById,
        disablePagination = false,
        onChangeQueryInput,
        loading = true,
        onCreateButtonClick,
        onRowClick,
        onCreateFolderButtonClick,
        onDelete,
        placeholderInput,
        rowActions,
        showNotificationSuccess,
        confirmDelete,
        customActions,
        variantPaper,
    } = props;

    /* State */
    const [openAdvancedSearch, setOpenAdvancedSearch] = useState<boolean>(false);
    const [rowSelected, setRowSelected] = useState<RowId[]>([]);
    const [queryInput, setQueryInput] = useState<QueryInput>({
        searchString: disableSearch ? undefined : '',
        pageIndex: disablePagination ? undefined : 0,
        pageSize: disablePagination ? undefined : Constants.PAGE_SIZE_DEFAULT,
        sortModel: [],
        advancedObject: undefined,
    });

    const [advancedObjectValue, setAdvancedObjectValue] = useState<
        Record<
            string,
            {
                value: unknown;
                label?: string;
            }
        >
    >({});

    const cachedQueryInput = useRef<QueryInput>(null);
    useEffect(() => {
        setRowSelected([]);
    }, [queryInput]);

    // TODO - Giải pháp tạm thời, sẽ thay thế bằng cách sử dụng pub-sub server-client
    useEffect(() => {
        if (location.state?.action === CloseAction.Reload || !isEqual(queryInput, cachedQueryInput.current)) {
            handleChangeQueryInput(cloneDeep(queryInput));
            cachedQueryInput.current = cloneDeep(queryInput);
        }
    }, [location.state, queryInput]);

    useEffect(() => {
        if (!loading && Array.isArray(rows) && rows?.length <= 0) {
            setQueryInput((oldQueryInput) => ({
                ...oldQueryInput,
                pageIndex: oldQueryInput.pageIndex ? oldQueryInput.pageIndex - 1 : 0,
            }));
        }
    }, [loading, rows, queryInput.pageIndex]);

    const handleChangeQueryInput = useCallback(
        debounce((queryInput) => {
            onChangeQueryInput(queryInput);
        }, 50),
        [onChangeQueryInput]
    );

    const handleDelete = <K extends string | number>(id: K) => {
        confirmDelete &&
            confirmDelete(() => {
                if (onDelete) {
                    onDelete(id).then(() => {
                        showNotificationSuccess && showNotificationSuccess();
                        onChangeQueryInput(queryInput);
                    });
                }
            });
    };

    const handleDeleteSelected = () => {
        confirmDelete &&
            confirmDelete(() => {
                if (onDeleteSelected) {
                    const idSelected = rowSelected.map((id) => id.toString());
                    onDeleteSelected(idSelected).then(() => {
                        showNotificationSuccess && showNotificationSuccess();
                        onChangeQueryInput(queryInput);
                    });
                }
            });
    };

    const updateQueryInput = (newValue: QueryInput) => {
        setQueryInput({
            ...queryInput,
            ...newValue,
        });
    };

    return (
        <Page
            caption={title}
            actions={
                <>
                    {!disableSearch && (
                        <SearchBox
                            includeSearchById={includeSearchById}
                            defaultValue={queryInput.searchString}
                            variantPaper={variantPaper}
                            onlyNumberString={onlyNumberString}
                            onSearch={(searchType, newValue) =>
                                updateQueryInput({
                                    pageIndex: 0,
                                    [searchType]: newValue,
                                })
                            }
                            {...(advancedSearchFields &&
                                advancedSearchFields.length > 0 && {
                                    onClickAdvancedSearch: () => setOpenAdvancedSearch(!openAdvancedSearch),
                                })}
                            placeholderInput={placeholderInput}
                        />
                    )}
                    {onCreateButtonClick && (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                marginLeft: (theme) => theme.spacing(2),
                            }}
                            onClick={onCreateButtonClick}
                        >
                            {t('Common.Create')}
                        </Button>
                    )}
                    {onCreateFolderButtonClick && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            title={t('DirectoryManagement.CreateDirectory')}
                            sx={{
                                marginLeft: (theme) => theme.spacing(1),
                            }}
                            onClick={onCreateFolderButtonClick}
                        >
                            <CreateNewFolderOutlined />
                        </Button>
                    )}
                    {customActions && customActions}
                </>
            }
        >
            {!!advancedSearchFields?.length && (
                <AdvancedSearch
                    fields={advancedSearchFields}
                    value={advancedObjectValue}
                    expanded={openAdvancedSearch}
                    onChangeValue={(obj) => {
                        if (obj) {
                            const { saveAdvancedObject, newAdvancedObject } = getAdvanceSearchValue(obj);

                            setAdvancedObjectValue(saveAdvancedObject);
                            updateQueryInput({
                                advancedObject: obj ? newAdvancedObject : undefined,
                            });
                        }
                    }}
                    onClear={() => {
                        setAdvancedObjectValue({});
                        updateQueryInput({ advancedObject: undefined });
                    }}
                />
            )}
            {loading ? (
                <CircularProgress />
            ) : (
                <DataGrid
                    columns={columns}
                    rows={rows}
                    getRowId={getRowId}
                    sortModel={queryInput.sortModel}
                    onSortModelChange={(sortModel) => updateQueryInput({ sortModel: sortModel })}
                    {...(checkboxSelection && {
                        selected: rowSelected,
                        onSelectedChange: (ids) => setRowSelected(ids),
                        selectionActions: [
                            {
                                icon: <DeleteIcon />,
                                tooltipTitle: t('Common.DeleteSelectedItems'),
                                action: () => handleDeleteSelected(),
                            },
                        ],
                    })}
                    {...(onRowClick && {
                        onRowClick: onRowClick,
                    })}
                    rowActions={[
                        ...(rowActions || []),
                        ...(onDelete
                            ? [
                                  {
                                      icon: <DeleteIcon />,
                                      tooltipTitle: t('Common.Delete'),
                                      action: handleDelete,
                                  },
                              ]
                            : []),
                    ]}
                    {...(!disablePagination && {
                        pageIndex: queryInput.pageIndex,
                        pageSize: queryInput.pageSize,
                        totalOfRows: totalOfRows,
                        onPageIndexChange: (pageIndex) => updateQueryInput({ pageIndex: pageIndex }),
                        onPageSizeChange: (pageSize) =>
                            updateQueryInput({
                                pageIndex: 0,
                                pageSize: pageSize,
                            }),
                    })}
                />
            )}
        </Page>
    );
}

export default PageManagement;
