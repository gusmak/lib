import { useMemo } from 'react';
import { compareTwoArrayObject, defaultTagValue } from '../common';
import { EnumSelectedPlaceType } from '../Enum';
import { IFilterChange, IFilterField, ITag } from '../interface';
import { isSelectedTagAllState, tagsAllState, tagSelectedState } from '../Recoil/Atom';
import FieldInputComponent from './component';
import { useAtom, useAtomValue } from 'jotai';

const FieldInput = () => {
    const [isSelectedTagAll, setIsSelectedTagAll] = useAtom(isSelectedTagAllState);
    const [tagSelected, setTagSelected] = useAtom(tagSelectedState);
    const tagsAll = useAtomValue(tagsAllState);

    const handleChange: IFilterChange = (newValue, index, isChangeOperator) => {
        setIsSelectedTagAll(false);
        // Compare filter with exist tags
        let newFilters =
            tagSelected?.filterFields?.map((input, idx) => {
                if (idx === index) {
                    return (isChangeOperator ? { ...input, endAdornmentValue: newValue } : { ...input, value: newValue }) as IFilterField;
                } else return input;
            }) || [];
        const existTags: ITag[] = tagsAll.tags || [];
        const duplicateTag = existTags.find((tag) => {
            return compareTwoArrayObject(tag.filterFields, newFilters).length === 0;
        });
        if (duplicateTag) {
            setTagSelected({ ...duplicateTag, filterFields: newFilters });
        } else {
            // Set tag prepare
            const tagPrepare: ITag = {
                filterFields: newFilters,
                selectedType: EnumSelectedPlaceType.IDS,
                selectedPlaceIds: [],
                filterPlaceIds: [],
                isTagPrepare: true,
            };
            setTagSelected(tagPrepare);
        }
    };
    const inputFilters = useMemo(() => {
        if (isSelectedTagAll) {
            return (tagSelected?.filterFields || []).map((input) => {
                return { ...input, value: defaultTagValue[input.type] };
            });
        }
        return tagSelected?.filterFields || [];
    }, [isSelectedTagAll, tagSelected]);

    return <FieldInputComponent inputFilters={inputFilters} onChange={handleChange} />;
};

export default FieldInput;
