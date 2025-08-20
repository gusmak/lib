import { useMemo, type ReactNode } from 'react';
import { Grid } from '@mui/material';
import { FilterTreeView } from 'AWING/DirectoryTree';
import DirectoryAction from '../components/DirectoryAction';
import SearchColumn from './SearchColumn';
import { directoriesState } from '../Atoms';
import { useAtomValue } from 'jotai';
import { ObjectTypeCode } from 'Features/types';
import { SearchValue } from './SearchColumn/types';

export type OwnProps = {
    // directories: Directory[];
    childDirectories: ReactNode;
    onTreeItemClick: (id: number) => void;
    onDirectoryOpen?: (directoryId: number) => void;
    deleteDirectory?: (directoryInfo: { id: number; parentObjectId?: number }) => void;
    loading?: boolean;
    objectTypeCodes?: ObjectTypeCode[];
    searchValue?: SearchValue;
    onSearch?: (data?: SearchValue) => void;
};

const DirectoryTreeView = (props: OwnProps) => {
    const { loading, childDirectories, searchValue, objectTypeCodes, onTreeItemClick, deleteDirectory, onDirectoryOpen, onSearch } = props;

    const directories = useAtomValue(directoriesState);

    const handleDeleteDirectory = (id: number, parentObjectId?: number) => {
        deleteDirectory && deleteDirectory({ id, parentObjectId });
    };

    const handleDirectoryOpen = (id: number | string) => {
        onDirectoryOpen && onDirectoryOpen(Number(id));
    };

    const handleTreeItemClick = (id: number | string) => {
        onTreeItemClick && onTreeItemClick(Number(id));
    };

    const treeViewItems = useMemo(() => {
        return [...directories].map((x) => ({
            ...x,
            value: Number(x.id),
            text: x.name ?? '',
            actions: (
                <DirectoryAction
                    id={x.id ?? -1}
                    isSystem={!!x.isSystem}
                    deleteDirectory={() => handleDeleteDirectory(Number(x.id), Number(x.parentObjectId))}
                />
            ),
        }));
    }, [directories]);

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
                <FilterTreeView
                    items={treeViewItems}
                    onDirectoryOpen={handleDirectoryOpen}
                    onTreeItemClick={handleTreeItemClick}
                    isLoading={loading}
                    rootDirectoryId={10}
                />
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ paddingTop: 1 }}>
                <SearchColumn searchValue={searchValue} onSearch={onSearch} objectTypeCodes={objectTypeCodes} />

                {childDirectories}
            </Grid>
        </Grid>
    );
};

export default DirectoryTreeView;
