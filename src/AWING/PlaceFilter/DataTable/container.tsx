import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isEqual, uniq } from 'lodash';
import { useAtom, useAtomValue } from 'jotai';
import { CircularProgress } from '../../../AWING';
import { compareTwoArrayObject } from '../common';
import { Constants } from 'Commons/Constant';
import { EnumSelectedPlaceType } from '../Enum';
import { IFilterField, IPlace, IPlaceQuery, ITag } from '../interface';
import { isSelectedTagAllState, tagsAllState, tagSelectedState } from '../Recoil/Atom';
import DataTableComponent from './component';

const getId = (row: IPlace) => {
    if (row.hasOwnProperty('id')) {
        return String(row['id']);
    } else {
        return undefined;
    }
};
export interface DataTableProps extends IPlaceQuery {
    isInit: boolean;
}
const DataTable: FC<DataTableProps> = (props) => {
    const { t } = useTranslation();
    const check = useRef<IFilterField[]>(null);
    const { getPlacesByFilter, getPlacesByIds } = props;
    const [places, setPlaces] = useState<IPlace[]>([]);
    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(Constants.PAGE_SIZE_DEFAULT);
    const [tagsAll, setTagsAll] = useAtom(tagsAllState);
    const [tagSelected, setTagSelected] = useAtom(tagSelectedState);
    const isSelectedTagAll = useAtomValue(isSelectedTagAllState);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const queryPlacesByFilter = () => {
        setIsLoading(true);
        getPlacesByFilter(tagSelected?.filterFields || [], pageIndex, pageSize)
            .then((data) => {
                setPlaces(data?.places || []);
                setTotal(data?.total || 0);
            })
            .catch(setIsError)
            .finally(() => {
                setIsLoading(false);
            });
    };

    const queryData = () => {
        if (!tagSelected?.filterFields?.length) return;
        if (isError) setIsError(() => false);
        if (isSelectedTagAll) {
            setIsLoading(() => true);
            getTagAllPlaces()
                .then(setPlaces)
                .catch(setIsError)
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            queryPlacesByFilter();
        }
    };
    useEffect(() => {
        if (pageIndex > 0) {
            setPageIndex(0);
        } else {
            if (!isEqual(check.current, tagSelected?.filterFields)) {
                queryData();
            }
            check.current = tagSelected?.filterFields ?? null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSelectedTagAll, tagSelected?.filterFields]);

    useEffect(() => {
        queryData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, isSelectedTagAll]);

    const getAllPlaces = () => {
        return getPlacesByFilter(tagSelected?.filterFields || []);
    };

    const getTagAllPlaces = () => {
        const ids = uniq([...(tagsAll.selectedPlaceIds || []), ...(tagsAll.filterPlaceIds || [])]);
        const pagingIds = ids.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
        setTotal(ids.length);
        return getPlacesByIds(pagingIds);
    };

    const unselectPlaceOfOtherTagWhenHaveNoTagSelected = (selectedIds: string[]) => {
        setTagsAll((prevState) => {
            let newTagAllSelectedIds: string[] = [];
            newTagAllSelectedIds = prevState.selectedPlaceIds!.filter((id) => {
                return selectedIds.indexOf(id) < 0;
            });
            return {
                tags: prevState.tags!.map((tagItem: ITag) => {
                    if (tagItem.selectedPlaceIds?.includes(selectedIds?.[0])) {
                        let newSelectedIds = tagItem.selectedPlaceIds.filter((id) => {
                            return selectedIds.indexOf(id) < 0;
                        });
                        return {
                            ...tagItem,
                            selectedType: EnumSelectedPlaceType.IDS,
                            selectedPlaceIds: newSelectedIds,
                        };
                    } else {
                        return tagItem;
                    }
                }),
                selectedPlaceIds: newTagAllSelectedIds,
                filterPlaceIds: prevState.filterPlaceIds,
            };
        });
    };

    const createNewTagWhenHaveNoTag = (newTag: ITag) => {
        const newTagAll = {
            tags: [newTag],
            selectedPlaceIds: newTag.selectedPlaceIds,
            filterPlaceIds: newTag.filterPlaceIds,
        };
        setTagSelected(newTag);
        setTagsAll(newTagAll);
    };

    const editTagSelected = (
        selectedPlaceType: EnumSelectedPlaceType,
        newSelectedPlaceIds: string[],
        newFilterPlaceIds: string[],
        newSelectedPlaceType: EnumSelectedPlaceType,
        checkedType: boolean
    ) => {
        setTagSelected((prevState) => {
            let temp: string[] = Object.assign([], newSelectedPlaceIds);
            if (newSelectedPlaceIds.length === 1 && !checkedType && !prevState?.selectedPlaceIds?.includes(newSelectedPlaceIds[0])) {
                // Case unslect a place of other tag
                temp =
                    prevState?.selectedPlaceIds?.filter((id) => {
                        return temp.indexOf(id) < 0;
                    }) || [];
            }
            return {
                ...prevState,
                selectedPlaceIds: selectedPlaceType !== EnumSelectedPlaceType.FILTER ? temp : [],
                filterPlaceIds: selectedPlaceType === EnumSelectedPlaceType.FILTER ? newFilterPlaceIds : [],
                selectedType: newSelectedPlaceType,
            };
        });
    };

    const selectMorePlaceWhenHaveTagSelected = (
        filterFields: IFilterField[],
        newSelectedPlaceIds: string[],
        newFilterPlaceIds: string[],
        newSelectedPlaceType: EnumSelectedPlaceType
    ) => {
        setTagsAll((prevState) => {
            let tmpSelectedPlaceIds: string[] = [];
            let tmpFilterPlaceIds: string[] = [];
            return {
                tags: prevState?.tags?.map((tagItem: ITag) => {
                    if (compareTwoArrayObject(tagItem?.filterFields, filterFields).length === 0) {
                        tmpSelectedPlaceIds.push(...newSelectedPlaceIds);
                        tmpFilterPlaceIds.push(...newFilterPlaceIds);
                        return {
                            ...tagItem,
                            selectedPlaceIds: newSelectedPlaceIds,
                            filterPlaceIds: newSelectedPlaceType === EnumSelectedPlaceType.FILTER ? newFilterPlaceIds : [],
                            selectedType: newSelectedPlaceType,
                        };
                    } else {
                        tmpSelectedPlaceIds.push(...(tagItem?.selectedPlaceIds || []));
                        tmpFilterPlaceIds.push(...(tagItem?.filterPlaceIds || []));
                        if (newSelectedPlaceIds.length > 0) {
                            return {
                                ...tagItem,
                                selectedPlaceIds: tagItem.selectedPlaceIds?.filter((id) => !newSelectedPlaceIds.includes(id)),
                            };
                        } else return tagItem;
                    }
                }),
                selectedPlaceIds: uniq(tmpSelectedPlaceIds),
                filterPlaceIds: uniq(tmpFilterPlaceIds),
            };
        });
    };

    const selectMorePlaceWhenHaveNoTagSelected = (newTag: ITag, newSelectedPlaceIds: string[], newFilterPlaceIds: string[]) => {
        setTagSelected(newTag);
        setTagsAll((prevState) => {
            let newTagAllSelectedIds: string[] = [];
            let newTagAllFilterIds: string[] = [];
            let prevTags = prevState.tags;
            newTagAllSelectedIds = [...prevState.selectedPlaceIds!, ...newSelectedPlaceIds];
            newTagAllFilterIds = [...prevState.filterPlaceIds!, ...newFilterPlaceIds];
            if (newSelectedPlaceIds.length > 0) {
                prevTags = prevTags?.map((tag: ITag) => {
                    return {
                        ...tag,
                        selectedPlaceIds: tag.selectedPlaceIds?.filter((id) => !newSelectedPlaceIds.includes(id)),
                    };
                });
            }
            return {
                tags: [...prevTags!, newTag],
                selectedPlaceIds: uniq(newTagAllSelectedIds),
                filterPlaceIds: uniq(newTagAllFilterIds),
            };
        });
    };

    const unselectOrUnfilterAllPlaceOfTag = (
        filterFields: IFilterField[],
        newSelectedPlaceIds: string[],
        newFilterPlaceIds: string[],
        newSelectedPlaceType: EnumSelectedPlaceType
    ) => {
        setTagsAll((prevState) => {
            let newTagAllSelectedIds: string[] = [];
            let newTagAllFilterIds: string[] = [];
            return {
                tags: prevState?.tags?.map((tagItem: ITag) => {
                    if (compareTwoArrayObject(tagItem?.filterFields, filterFields).length === 0) {
                        newTagAllFilterIds.push(...newFilterPlaceIds);
                        newTagAllSelectedIds.push(...newSelectedPlaceIds);
                        return {
                            ...tagItem,
                            selectedPlaceIds: newSelectedPlaceIds,
                            filterPlaceIds: [],
                            selectedType: newSelectedPlaceType,
                        };
                    } else {
                        newTagAllFilterIds.push(...(tagItem?.filterPlaceIds || []));
                        newTagAllSelectedIds.push(...(tagItem?.selectedPlaceIds || []));
                        return tagItem;
                    }
                }),
                selectedPlaceIds: newTagAllSelectedIds,
                filterPlaceIds: newTagAllFilterIds,
            };
        });
    };

    const unselectAPlaceWhenHaveTagSelected = (selectedIds: string[]) => {
        setTagsAll((prevState) => {
            const prevTagSelected = prevState?.tags?.find((t: ITag) => {
                return compareTwoArrayObject(t.filterFields, tagSelected?.filterFields).length === 0;
            });
            let newTagAllSelectedIds: string[] = [];
            if (selectedIds.length === 1 && !prevTagSelected?.selectedPlaceIds?.includes(selectedIds[0])) {
                // Case unselect place of other tag
                newTagAllSelectedIds = prevState?.selectedPlaceIds!.filter((id) => {
                    return selectedIds.indexOf(id) < 0;
                });
                return {
                    tags: prevState.tags!.map((tagItem: ITag) => {
                        if (tagItem.selectedPlaceIds?.includes(selectedIds?.[0])) {
                            let newSelectedIds = tagItem.selectedPlaceIds.filter((id) => {
                                return selectedIds.indexOf(id) < 0;
                            });
                            return {
                                ...tagItem,
                                selectedType: EnumSelectedPlaceType.IDS,
                                selectedPlaceIds: newSelectedIds,
                            };
                        } else {
                            return tagItem;
                        }
                    }),
                    selectedPlaceIds: newTagAllSelectedIds,
                    filterPlaceIds: prevState.filterPlaceIds,
                };
            } else {
                // Case unselect place of selected tag
                return {
                    tags: prevState.tags!.map((tagItem: ITag) => {
                        if (compareTwoArrayObject(tagItem.filterFields, tagSelected?.filterFields).length === 0) {
                            newTagAllSelectedIds.push(...selectedIds);
                            return {
                                ...tagItem,
                                selectedPlaceIds: selectedIds,
                            };
                        } else {
                            newTagAllSelectedIds.push(...(tagItem?.selectedPlaceIds || []));
                            return tagItem;
                        }
                    }),
                    selectedPlaceIds: newTagAllSelectedIds,
                    filterPlaceIds: prevState.filterPlaceIds,
                };
            }
        });
    };

    const handleSelectPlace = (filterFields: IFilterField[], selectedIds: string[]) => {
        if (tagsAll === undefined || tagsAll?.tags?.length === 0) {
            if (selectedIds.length > 0) {
                const newTag: ITag = {
                    filterFields: filterFields,
                    selectedPlaceIds: selectedIds,
                    filterPlaceIds: [],
                    selectedType: EnumSelectedPlaceType.IDS,
                } as ITag;
                createNewTagWhenHaveNoTag(newTag);
            }
        } else {
            if (!tagSelected?.isTagPrepare) {
                editTagSelected(EnumSelectedPlaceType.IDS, selectedIds, [], EnumSelectedPlaceType.IDS, true);
                selectMorePlaceWhenHaveTagSelected(filterFields, selectedIds, [], EnumSelectedPlaceType.IDS);
            } else {
                const newTag: ITag = {
                    filterFields: filterFields,
                    selectedPlaceIds: selectedIds,
                    filterPlaceIds: [],
                    selectedType: EnumSelectedPlaceType.IDS,
                } as ITag;
                selectMorePlaceWhenHaveNoTagSelected(newTag, selectedIds, []);
            }
        }
    };

    const handleUnselectPlace = (selectedIds: string[]) => {
        if (!tagSelected?.isTagPrepare) {
            editTagSelected(EnumSelectedPlaceType.IDS, selectedIds, [], EnumSelectedPlaceType.IDS, false);
            unselectAPlaceWhenHaveTagSelected(selectedIds);
        } else {
            unselectPlaceOfOtherTagWhenHaveNoTagSelected(selectedIds);
        }
    };

    const handleSelectPlaceByFilter = (filterFields: IFilterField[], selectedIds: string[]) => {
        if (tagsAll === undefined || tagsAll?.tags?.length === 0) {
            if (selectedIds.length > 0) {
                const newTag: ITag = {
                    filterFields: filterFields,
                    selectedPlaceIds: [],
                    filterPlaceIds: selectedIds,
                    selectedType: EnumSelectedPlaceType.FILTER,
                } as ITag;
                createNewTagWhenHaveNoTag(newTag);
            }
        } else {
            if (!tagSelected?.isTagPrepare) {
                editTagSelected(EnumSelectedPlaceType.FILTER, [], selectedIds, EnumSelectedPlaceType.FILTER, true);
                selectMorePlaceWhenHaveTagSelected(filterFields, [], selectedIds, EnumSelectedPlaceType.FILTER);
            } else {
                const newTag: ITag = {
                    filterFields: filterFields,
                    selectedPlaceIds: [],
                    filterPlaceIds: selectedIds,
                    selectedType: EnumSelectedPlaceType.FILTER,
                } as ITag;
                selectMorePlaceWhenHaveNoTagSelected(newTag, [], selectedIds);
            }
        }
    };

    const handleUnselectPlaceByFilter = (filterFields: IFilterField[]) => {
        editTagSelected(EnumSelectedPlaceType.FILTER, [], [], EnumSelectedPlaceType.IDS, false);
        unselectOrUnfilterAllPlaceOfTag(filterFields, [], [], EnumSelectedPlaceType.IDS);
    };

    const createOrEditTags = (selectedIds: string[], selectedPlaceType: EnumSelectedPlaceType, checkedType: boolean) => {
        const filterFields: IFilterField[] = tagSelected?.filterFields || [];
        if (selectedPlaceType === EnumSelectedPlaceType.IDS) {
            if (checkedType) {
                handleSelectPlace(filterFields, selectedIds);
            } else {
                handleUnselectPlace(selectedIds);
            }
        }

        if (selectedPlaceType === EnumSelectedPlaceType.FILTER) {
            if (checkedType) {
                handleSelectPlaceByFilter(filterFields, selectedIds);
            } else {
                handleUnselectPlaceByFilter(filterFields);
            }
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            getAllPlaces().then((data) => {
                const selectAllIds = data?.places?.map((place) => place.id) || [];
                createOrEditTags(selectAllIds.map(String), EnumSelectedPlaceType.IDS, checked);
            });
        } else {
            createOrEditTags([], EnumSelectedPlaceType.IDS, checked);
        }
    };

    const handleSelectFilter = (checked: boolean) => {
        if (checked) {
            getAllPlaces().then((data) => {
                const selectAllIds = data?.places?.map((place) => place.id) || [];
                createOrEditTags(selectAllIds.map(String), EnumSelectedPlaceType.FILTER, checked);
            });
        } else {
            createOrEditTags([], EnumSelectedPlaceType.FILTER, checked);
        }
    };

    const handleSelect = (checked: boolean, id: string) => {
        if (checked) {
            let newSelected = tagSelected?.selectedPlaceIds?.slice() || [];
            newSelected.push(id);
            createOrEditTags(newSelected, EnumSelectedPlaceType.IDS, checked);
        } else {
            let newSelected = tagSelected?.selectedPlaceIds?.slice() || [];
            const index = newSelected?.indexOf(id);
            if (index !== -1) {
                newSelected.splice(index, 1);
                createOrEditTags(newSelected || [], EnumSelectedPlaceType.IDS, checked);
            } else {
                // Case unselect a place of other tag
                createOrEditTags([id], EnumSelectedPlaceType.IDS, checked);
            }
        }
    };
    const getAllSelected = () => {
        const selectedPlaceIds = tagsAll?.selectedPlaceIds || [];
        const filterPlaceIds = tagsAll?.filterPlaceIds || [];
        const mergSelected = [...selectedPlaceIds, ...filterPlaceIds];
        return mergSelected?.filter((item, index: number) => mergSelected.indexOf(item) === index);
    };

    const handlePageIndexChange = (pageIndex: number) => {
        setPageIndex(pageIndex);
    };

    const handlePageSizeChange = (pageSize: number) => {
        setPageSize(pageSize);
    };

    return isError ? (
        <div
            style={{
                padding: 2 * 8,
                textAlign: 'center',
                color: 'black', //theme.palette.text.secondary
                textDecoration: 'underline',
                cursor: 'pointer',
            }}
            onClick={() => {
                queryData();
            }}
        >
            {t('Common.Reload')}
        </div>
    ) : !isLoading ? (
        <DataTableComponent
            tagsAll={tagsAll}
            tagSelected={tagSelected}
            isShowTotalSelected={isSelectedTagAll}
            pages={{
                pageIndex,
                pageSize,
                total,
                onPageIndexChange: handlePageIndexChange,
                onPageSizeChange: handlePageSizeChange,
            }}
            places={places}
            totalSelected={getAllSelected().length}
            onSelectAll={handleSelectAll}
            onSelectFilter={handleSelectFilter}
            onSelect={handleSelect}
            getId={getId}
        />
    ) : (
        <CircularProgress />
    );
};
export default DataTable;
