import { FC, useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Paper, Button, Grid } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Constants } from 'Commons/Constant';
import EnhancedDialog from 'Commons/Components/DeprecatedEnhancedDialog';
import { DataGrid, GridSortModel, Page, QueryInput, SearchBox, SearchType } from 'AWING';
import { User } from 'Features/SYSTEM/User/types';
import { offlinePaginate } from 'Helpers/api';

interface EnhancedTableComponentProps {
    rows: User[];
    onChangeDeleted?: (ids: number[], description: string) => void;
}
const EnhancedTableComponent: FC<EnhancedTableComponentProps> = (props) => {
    const { t } = useTranslation();
    const { rows, onChangeDeleted } = props;

    const [isOpenDialog, setIsOpenDialog] = useState(false);

    const [users, setUsers] = useState<User[]>([]);

    const [deletedUser, setDeletedUser] = useState<number[]>([]);

    const [sortModels, setSortModels] = useState<GridSortModel[]>([]);

    const [queryInput, setQueryInput] = useState<QueryInput>({
        pageIndex: 0,
        pageSize: Constants.PAGE_SIZE_DEFAULT,
    });

    useLayoutEffect(() => {
        setUsers(rows);
    }, [rows]);

    useEffect(() => {
        setUsers(
            rows.filter((item) =>
                (['name', 'username'] as (keyof User)[]).some((key) =>
                    item[key]
                        ?.toString()
                        .toLowerCase()
                        .includes(queryInput?.searchString?.trim().toLowerCase() || '')
                )
            )
        );
    }, [queryInput.searchString, rows]);

    useEffect(() => {
        sortModels.length &&
            setUsers((prev) =>
                prev.concat().sort((a, b) => {
                    const { field, sort } = sortModels.at(-1)!;
                    const aValue = a[field as keyof User];
                    const bValue = b[field as keyof User];
                    if (typeof aValue === 'string' && typeof bValue === 'string') {
                        return aValue.localeCompare(bValue) * (sort === 'asc' ? 1 : -1);
                    }
                    if (typeof aValue === 'number' && typeof bValue === 'number') {
                        return (aValue - bValue) * (sort === 'asc' ? 1 : -1);
                    }
                    return 0;
                })
            );
    }, [sortModels]);

    const handleDeleted = (id: number) => {
        setIsOpenDialog(true);
        setDeletedUser([id]);
    };

    const handleSubmitDialog = (description: string) => {
        setIsOpenDialog(false);
        onChangeDeleted && onChangeDeleted(deletedUser, description);
    };

    return (
        <Grid component={Paper} sx={{ p: 3, ml: 3, mr: 3, mb: 3 }}>
            <Page
                caption={t('UserGroup.TitleUserManagement')}
                actions={
                    <>
                        <SearchBox
                            onSearch={function (_searchType: SearchType, searchString: string): void {
                                setQueryInput((prev) => ({
                                    ...prev,
                                    pageIndex: 0,
                                    pageSize: Constants.PAGE_SIZE_DEFAULT,
                                    searchString,
                                }));
                            }}
                            placeholderInput={t('Common.SearchPlaceholder')}
                        />
                        <Button
                            component={Link}
                            variant="outlined"
                            color="secondary"
                            sx={(theme) => ({
                                backgroundColor: theme.palette.action.hover,
                                '&:hover': {
                                    backgroundColor: theme.palette.secondary.main,
                                    border: '1px solid lightgray',
                                },
                                color: theme.palette.text.primary,
                                border: '1px solid lightgray',
                                marginLeft: (theme) => theme.spacing(2),
                            })}
                            to={Constants.ADD_USER_TO_GROUP_PATH}
                        >
                            {t('UserGroup.TitleAdd')}
                        </Button>
                    </>
                }
            >
                <DataGrid
                    columns={[
                        {
                            field: '#',
                            headerName: t('User.STT'),
                            valueGetter: (_row, _idx, stt) => stt,
                        },
                        {
                            field: 'username',
                            headerName: t('User.Username'),
                            sortable: true,
                        },
                        {
                            field: 'name',
                            headerName: t('User.Name'),
                            sortable: true,
                        },
                    ]}
                    rows={offlinePaginate(users, queryInput.pageIndex!, queryInput.pageSize!)}
                    sortModel={sortModels}
                    pageSize={queryInput.pageSize}
                    pageIndex={queryInput.pageIndex}
                    totalOfRows={users.length || 0}
                    onSortModelChange={setSortModels}
                    getRowId={(row) => row.id}
                    onPageIndexChange={(pageIndex) => {
                        setQueryInput((prev) => ({ ...prev, pageIndex }));
                    }}
                    onPageSizeChange={(pageSize) => {
                        setQueryInput((prev) => ({
                            ...prev,
                            pageSize,
                            pageIndex: 0,
                        }));
                    }}
                    rowActions={[
                        {
                            icon: <DeleteIcon />,
                            tooltipTitle: t('Common.Delete'),
                            action: handleDeleted,
                        },
                    ]}
                />
            </Page>
            <EnhancedDialog
                isOpen={isOpenDialog}
                onSubmit={handleSubmitDialog}
                onClose={() => setIsOpenDialog(false)}
                label={t('Dialog.Reason')}
                title={t('Dialog.Confirm')}
                content={t('Dialog.AgreeDelete')}
            />
        </Grid>
    );
};

export default EnhancedTableComponent;
