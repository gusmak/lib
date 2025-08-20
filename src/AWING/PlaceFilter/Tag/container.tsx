import { ITag, ITagAll } from '../interface';
import { Grid } from '@mui/material';
import TagAll from './component/TagAll';
import TagChip from './component/TagChip';
import { isSelectedTagAllState, snapTagsAllState, tagsAllState, tagSelectedState } from '../Recoil/Atom';
import { compareTwoArrayObject } from '../common';
import { EnumSelectedPlaceType } from '../Enum';
import { useEffect } from 'react';
import { SET_SNAP_TAGS_ALL_TIMEOUT } from '../constants';
import { debounce } from 'lodash';
import { useAtom } from 'jotai';

const replaceSnapTagsAll = debounce((newTagsAll: ITagAll, setAction: (snap: ITagAll) => void) => {
    setAction(newTagsAll);
}, SET_SNAP_TAGS_ALL_TIMEOUT);
const generateDefaultTag = (tag?: ITag) => {
    return {
        filterFields:
            tag?.filterFields?.map((f) => {
                return { ...f, value: undefined };
            }) || [],
        selectedType: EnumSelectedPlaceType.IDS,
        selectedPlaceIds: [],
        filterPlaceIds: [],
        isTagPrepare: true,
    } as ITag;
};
const Tag = () => {
    const [tagsAll, setTagsAll] = useAtom(tagsAllState);
    const [snapTagsAll, setSnapTagsAll] = useAtom(snapTagsAllState);
    const [tagSelected, setTagSelected] = useAtom(tagSelectedState);
    const [isSelectedTagAll, setIsSelectedTagAll] = useAtom(isSelectedTagAllState);

    useEffect(() => {
        replaceSnapTagsAll(tagsAll, setSnapTagsAll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagsAll]);

    const handleDeleteTag = (tagIndex: number) => {
        const deleteTag = tagsAll?.tags?.[tagIndex];
        const deleteTagIsSelectedTag = compareTwoArrayObject(deleteTag?.filterFields, tagSelected?.filterFields).length === 0;
        if (deleteTagIsSelectedTag) {
            if (tagIndex === 0) {
                if (tagsAll?.tags?.[1]) {
                    setTagSelected(tagsAll?.tags?.[1]);
                } else {
                    setTagSelected(generateDefaultTag(tagSelected));
                }
            } else {
                setTagSelected(tagsAll?.tags?.[tagIndex - 1]);
            }
        }

        setTagsAll((prevState) => {
            const newTagAllSelectedIds: string[] = [];
            const newTagAllFilterIds: string[] = [];
            return {
                tags: prevState?.tags
                    ?.filter((_i, index: number) => index !== tagIndex)
                    .map((item) => {
                        newTagAllSelectedIds.push(...item.selectedPlaceIds!);
                        newTagAllFilterIds.push(...item.filterPlaceIds!);
                        return item;
                    }),
                selectedPlaceIds: newTagAllSelectedIds,
                filterPlaceIds: newTagAllFilterIds,
            };
        });
    };

    const handleClickTag = (tag: ITag) => {
        setIsSelectedTagAll(false);
        setTagSelected(tag);
    };
    const handleClickTagAll = () => {
        setIsSelectedTagAll(true);
    };

    const isTagFocused = (tagItem: ITag) => {
        return !!(tagSelected && compareTwoArrayObject(tagSelected?.filterFields, tagItem.filterFields).length === 0 && !isSelectedTagAll);
    };

    const getNumOfPreviousPlaces = (tag: ITag) => {
        const snapTag = snapTagsAll?.tags?.find((t: ITag) => {
            return compareTwoArrayObject(tag.filterFields, t.filterFields).length === 0;
        });
        return snapTag?.filterPlaceIds?.length || snapTag?.selectedPlaceIds?.length || 0;
    };
    return (
        <Grid
            size={12}
            style={{
                border: '1px solid #EEEEEE',
                minHeight: '50px',
                margin: '16px 0px',
            }}
        >
            {tagsAll && tagsAll.tags && tagsAll.tags?.length > 1 && (
                <TagAll tagsAll={tagsAll} snapTagsAll={snapTagsAll} isFocused={isSelectedTagAll} onClickTagAll={handleClickTagAll} />
            )}
            {tagsAll &&
                tagsAll?.tags?.map((tagItem, tagIndex: number) => {
                    return (
                        <TagChip
                            key={tagIndex}
                            isFocused={isTagFocused(tagItem)}
                            numOfPreviousPlaces={getNumOfPreviousPlaces(tagItem)}
                            tagItem={tagItem}
                            onDeleteTag={() => handleDeleteTag(tagIndex)}
                            onClickTag={() => handleClickTag(tagItem)}
                        />
                    );
                })}
        </Grid>
    );
};
export default Tag;
