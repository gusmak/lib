import { useState, useCallback, useEffect, type MouseEvent, type ChangeEvent } from 'react';
import { Routes, Route } from 'react-router';
import { isEqual, unionWith, includes, isUndefined } from 'lodash';
import { useAtom } from 'jotai';
import { CircularProgress, DirectoryForm } from 'AWING';
import { Constants as CommonConstants } from 'Commons/Constant';
import { useAppHelper } from 'Context';
import { directoriesState } from './Atoms';
import DirectoryTreeView from './TreeView';
import { Constants } from './constants';
import DirectoryChildList from './TreeView/DirectoryChildList';
import { getFormatDirectoriesData, isSearch } from './helpers';
import { useGetDirectoryContext } from './context';
import type { SearchValue, AdvancedValue } from './TreeView/SearchColumn/types';
import type { Directory } from './types';

function Container() {
    const { confirm, snackbar } = useAppHelper();

    const { parentDirectoryId, currentWorkspace, objectTypeCodes, services } = useGetDirectoryContext();

    const [pageIndex, setPageIndex] = useState(0);
    const [directoryIdQueried, setDirectoryIdQueried] = useState<number[]>([]);
    const [focusDirectoryId, setForcusDirectoryId] = useState<number>(0);
    const [pageSize, setPageSize] = useState(CommonConstants.PAGE_SIZE_DEFAULT);
    /** Directory Root */
    const [directories, setDirectories] = useAtom(directoriesState);
    const [loadingDirectories, setLoadingDirectories] = useState(true);
    /** Directory children */
    const [childDirectories, setChildDirectories] = useState<Directory[]>([]);
    const [childDirectoriesTotal, setChildDirectoriesTotal] = useState<number>(0);
    const [loadingChildDirectories, setLoadingChildDirectories] = useState(false);

    const [searchValue, setSearchValue] = useState<{
        searchKey: string;
        advancedObject?: AdvancedValue;
    }>({
        searchKey: '',
        advancedObject: undefined,
    });

    /** If current Workspace change, callback data */
    useEffect(() => {
        if (parentDirectoryId) {
            queryData(parentDirectoryId);
        }
    }, [currentWorkspace?.id, parentDirectoryId]);

    /** Get Directory Root */
    const queryData = async (directoryId: number, depthFromRoot = 2) => {
        const queryDepthFromRoot = depthFromRoot === -1 ? {} : { depthFromRoot };
        await services
            ?.getDirectories({
                where: {
                    isFile: { eq: false },
                },
                workspaceId: currentWorkspace?.id,
                parentDirectoryId: directoryId,
                ...queryDepthFromRoot,
            })
            .then((data) => {
                setLoadingDirectories(false);
                setDirectoryIdQueried([...directoryIdQueried, directoryId]);

                const result = unionWith(directories, getFormatDirectoriesData(data.items), isEqual);
                setDirectories(result);
            });
    };

    /** Get Directory children */
    const queryChildDirectoriesData = useCallback(
        async (
            newFocusDirectoryId: number,
            newPageIndex: number,
            newPageSize: number,
            depthFromRoot = 1,
            searchKey = '',
            objectTypeCode?: string
        ) => {
            setLoadingChildDirectories(true);
            const queryObjectTypeCode = objectTypeCode ? { objectTypeCode: { eq: objectTypeCode } } : {};
            const queryDepthFromRoot = depthFromRoot === -1 ? {} : { depthFromRoot };
            await services
                ?.getDirectories({
                    parentDirectoryId: newFocusDirectoryId,
                    where: {
                        name: { contains: searchKey },
                        id: { neq: newFocusDirectoryId },
                        ...queryObjectTypeCode,
                    },
                    ...queryDepthFromRoot,
                    skip: newPageIndex * newPageSize,
                    take: newPageSize,
                })
                .then((data) => {
                    setLoadingChildDirectories(false);
                    setChildDirectories(data.items);
                    setChildDirectoriesTotal(data.total);
                });
        },
        []
    );

    const handleChildrenSearch = (data?: SearchValue) => {
        if (!data) return;

        const { searchKey = '', advancedObject } = data;
        setSearchValue({
            searchKey,
            advancedObject: data.advancedObject,
        });

        queryChildDirectoriesData(focusDirectoryId, pageIndex, pageSize, -1, searchKey, advancedObject?.objectTypeCode.value);
    };

    const handleDirectoryOpen = (directoryId: number) => {
        directoryId !== focusDirectoryId && setForcusDirectoryId(directoryId);

        if (!includes(directoryIdQueried, directoryId)) queryData(directoryId);
    };

    /** Open dialog confirm then delete */
    const handleDeleteDirectory = (directoryInfo: { id: number; parentObjectId?: number }) => {
        confirm(() => {
            services?.deleteDirectory({ id: directoryInfo.id }).then(() => {
                snackbar('success');
                currentWorkspace?.id && queryData(currentWorkspace.id);
            });
        });
    };

    /** Fetch child directory when click on tree item */
    const handleTreeItemClick = (id: number) => {
        setSearchValue({
            searchKey: '',
            advancedObject: undefined,
        });

        setForcusDirectoryId(id);
        setPageIndex(0);
        queryChildDirectoriesData(id, 0, CommonConstants.PAGE_SIZE_DEFAULT);
    };

    /** Fetch child directory when change page */
    const handleChangePage = (_e: MouseEvent<HTMLButtonElement> | null, newPageIndex: number) => {
        setPageIndex(newPageIndex);

        if (isSearch(searchValue)) {
            queryChildDirectoriesData(
                focusDirectoryId,
                newPageIndex,
                pageSize,
                -1,
                searchValue.searchKey,
                searchValue?.advancedObject?.objectTypeCode?.value
            );
        } else queryChildDirectoriesData(focusDirectoryId, newPageIndex, pageSize);
    };

    /** Fetch child directory when change row per page */
    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        const newPageSize = parseInt(event.target.value);
        setPageSize(newPageSize);
        if (isSearch(searchValue)) {
            queryChildDirectoriesData(
                focusDirectoryId,
                0,
                newPageSize,
                -1,
                searchValue.searchKey,
                searchValue?.advancedObject?.objectTypeCode?.value
            );
        } else queryChildDirectoriesData(focusDirectoryId, 0, newPageSize);
    };

    return (
        <>
            <DirectoryTreeView
                onDirectoryOpen={handleDirectoryOpen}
                onTreeItemClick={handleTreeItemClick}
                deleteDirectory={handleDeleteDirectory}
                loading={loadingDirectories}
                searchValue={searchValue}
                onSearch={handleChildrenSearch}
                objectTypeCodes={objectTypeCodes}
                childDirectories={
                    loadingChildDirectories ? (
                        <CircularProgress />
                    ) : (
                        <DirectoryChildList
                            pageSize={pageSize}
                            pageIndex={pageIndex}
                            directoriesQuery={{
                                items: getFormatDirectoriesData(childDirectories),
                                totalCount: childDirectoriesTotal,
                            }}
                            deleteDirectory={handleDeleteDirectory}
                            handleChangePage={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    )
                }
            />

            {/* Routes */}
            <Routes>
                {services ? (
                    <>
                        <Route
                            key={Constants.CREATE_PATH + '/:directoryId'}
                            path={Constants.CREATE_PATH + '/:directoryId'}
                            element={
                                <DirectoryForm
                                    isCreate
                                    createDirectory={services.createDirectory}
                                    getDirectoryById={services.getDirectoryById}
                                    updateDirectory={services.updateDirectory}
                                    onUpdateDirectories={() => !isUndefined(parentDirectoryId) && queryData(parentDirectoryId)}
                                />
                            }
                        />
                        <Route
                            key={Constants.EDIT_PATH + '/:directoryId'}
                            path={Constants.EDIT_PATH + '/:directoryId'}
                            element={
                                <DirectoryForm
                                    createDirectory={services.createDirectory}
                                    getDirectoryById={services.getDirectoryById}
                                    updateDirectory={services.updateDirectory}
                                    onUpdateDirectories={() => !isUndefined(parentDirectoryId) && queryData(parentDirectoryId)}
                                />
                            }
                        />
                    </>
                ) : null}
            </Routes>
        </>
    );
}

export default Container;
