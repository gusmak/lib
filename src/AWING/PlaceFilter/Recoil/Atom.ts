import { atom } from 'jotai';
import { ITagAll, ITag } from '../interface';

export const tagsAllState = atom<ITagAll>({
    selectedPlaceIds: [],
    filterPlaceIds: [],
    tags: [],
});

export const snapTagsAllState = atom<ITagAll>({
    selectedPlaceIds: [],
    filterPlaceIds: [],
    tags: [],
});

export const tagSelectedState = atom<ITag | undefined>(undefined);

export const isSelectedTagAllState = atom<boolean>(false);
