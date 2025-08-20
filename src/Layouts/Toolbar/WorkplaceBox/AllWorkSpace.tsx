import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Constants } from 'Commons/Constant';
import { changeToAlias, offlinePaginate } from 'Helpers';
import { Drawer, PageManagement, type QueryInput } from 'AWING';
import { Workspace } from '../Types';

export type AllWorkSpaceProps = {
    isOpen?: boolean;
    allWorkSpace: Workspace[];
    onClose: () => void;
    setCurrentWorkspace: (item: Workspace) => void;
};

function AllWorkSpace(props: AllWorkSpaceProps) {
    const { t } = useTranslation();
    const { isOpen = false, onClose, allWorkSpace, setCurrentWorkspace } = props;

    const [rowsData, setRowsData] = useState<Workspace[]>([]);
    const [queryInput, setQueryInput] = useState<QueryInput>({
        searchString: '',
        pageIndex: 0,
        pageSize: Constants.PAGE_SIZE_DEFAULT,
    });

    useEffect(() => {
        setRowsData(allWorkSpace);
    }, [allWorkSpace]);

    const hangleChangeQueryInput = useCallback((queryParams: QueryInput) => {
        setQueryInput(queryParams);
    }, []);

    const handleRowClick = (id: number) => {
        const workspace = rowsData.find((item) => item.id === id);
        if (workspace) {
            setCurrentWorkspace(workspace);
            onClose();
        }
    };

    const getDomainBySearchString = useMemo(() => {
        return rowsData?.filter((row) => changeToAlias(row.name!).includes(changeToAlias(queryInput.searchString!))) ?? [];
    }, [rowsData, queryInput.searchString]);

    return (
        <Drawer title={t('Common.SelectWorkSpace')} onClose={onClose} open={isOpen}>
            <PageManagement
                title=""
                onChangeQueryInput={hangleChangeQueryInput}
                getRowId={(obj) => obj.id}
                columns={[
                    {
                        field: '#',
                        headerName: '#',
                        width: 100,
                        valueGetter: (_, _idx, stt) => stt,
                    },
                    {
                        field: 'id',
                        headerName: 'ID',
                    },
                    {
                        field: 'name',
                        headerName: `${t('Common.Name')}`,
                    },
                ]}
                rows={offlinePaginate(getDomainBySearchString, queryInput.pageIndex!, queryInput.pageSize!)}
                totalOfRows={getDomainBySearchString?.length}
                onRowClick={handleRowClick}
                loading={false}
            />
        </Drawer>
    );
}

export default AllWorkSpace;
