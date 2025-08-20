import { FC, useEffect, useState } from 'react';
import { ITag, PlaceFilterProps } from './interface';
import { Box } from '@mui/material';
import FieldInput from './Input';
import DataTable from './DataTable';
import { EnumSelectedPlaceType } from './Enum';
import Tag from './Tag';
import { tagsAllState, snapTagsAllState, tagSelectedState } from './Recoil/Atom';
import { uniq } from 'lodash';
import { useAtom, useSetAtom } from 'jotai';

const generateTagAll = (tags: ITag[] | undefined) => {
    let selectedIds: string[] = [];
    let filterIds: string[] = [];
    if (tags && tags.length > 0) {
        tags.map((t) => {
            selectedIds = [...selectedIds, ...t.selectedPlaceIds!];
            filterIds = [...filterIds, ...t.filterPlaceIds!];
        });
    }
    return {
        tags: tags || [],
        selectedPlaceIds: uniq(selectedIds),
        filterPlaceIds: uniq(filterIds),
    };
};

const PlaceFilterContainer: FC<PlaceFilterProps> = (props) => {
    const { filterFields, getPlacesByFilter, getPlacesByIds, callbackFunction, tags } = props;

    const [isInit, setIsInit] = useState(true);
    const [tagsAll, setTagsAll] = useAtom(tagsAllState);
    const setSnapTagsAll = useSetAtom(snapTagsAllState);
    const setTagSelected = useSetAtom(tagSelectedState);

    useEffect(() => {
        const tagAll = generateTagAll(tags);

        if (tags && tags[0]) {
            setTagSelected(tags[0]);
        } else {
            setTagSelected({
                filterFields,
                selectedType: EnumSelectedPlaceType.IDS,
                filterPlaceIds: [],
                selectedPlaceIds: [],
                isTagPrepare: true,
            });
        }
        setTagsAll(tagAll);
        setSnapTagsAll(tagAll);
        setIsInit(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        callbackFunction(tagsAll?.selectedPlaceIds || [], tagsAll?.filterPlaceIds || [], tagsAll?.tags || []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagsAll]);

    return (
        <Box sx={{ flexGrow: 1 }} style={{ marginTop: '10px' }}>
            <FieldInput />
            <Tag />
            <DataTable isInit={isInit} getPlacesByFilter={getPlacesByFilter} getPlacesByIds={getPlacesByIds} />
        </Box>
    );
};
export default PlaceFilterContainer;
