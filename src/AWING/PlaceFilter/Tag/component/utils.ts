import { EnumFieldInputType } from 'AWING/PlaceFilter/Enum';
import { IFilterField, ITag } from 'AWING/PlaceFilter/interface';
import { isEqual, memoize } from 'lodash';
import i18n from 'translate/i18n';
import { Typography } from '@mui/material';
import { createElement as _c } from 'react';
import styled from '@emotion/styled';

import { NEGATIVE_COLOR, NORMAL_COLOR, POSITIVE_COLOR } from 'Commons/Constant';
import { MAX_TAG_TITLE_LENGTH } from '../../constants';
export const CustomSpan = styled.span`
    color: ${(props) => props.color};
    margin-left: 5px;
`;
const isTagFilterHaveValue = (filter: IFilterField) => {
    return filter.value !== undefined && filter.value !== '' && filter.value !== null && !isEqual(filter.value, []);
};
const selectAreaType = ['PlaceFilter.Province', 'PlaceFilter.District', 'PlaceFilter.Ward'];
const groupInputHandler: { [K in EnumFieldInputType]: (tagItem: Extract<IFilterField, { type: K }>) => string[] } = {
    [EnumFieldInputType.TEXT]: (tagItem) => [`${tagItem.label}: ${tagItem.value}`],
    [EnumFieldInputType.SELECT_AREA]: (tagItem) => tagItem.value.map((p) => `${i18n.t(selectAreaType[p.type!])}: ${p.name}`),
    [EnumFieldInputType.SELECT]: (tagItem) => {
        const item = tagItem.inputParameter.find((i) => i.id === tagItem.value);
        return [`${tagItem.label}: ${item?.name || tagItem.value}`];
    },
    [EnumFieldInputType.MULTIPLE_HIERARCHICAL_CHOICE]: (tagItem) => {
        const details: string[] = [];
        if (tagItem.value.length > 0) {
            details.push(`${tagItem.label}${tagItem.endAdornmentValue ? ` (${tagItem.endAdornmentValue})` : ''}:`);
        }
        tagItem.value.forEach((p) => {
            let result = '';
            for (let i = 0; i < p.length; i++) {
                result = `${result}${result ? ' - ' : ''}${p[i]?.name}`;
            }
            details.push(result);
        });
        return details;
    },
    [EnumFieldInputType.AUTO_COMPLETE]: (tagItem) => {
        const item = tagItem.inputParameter.find((i) => i.id === tagItem.value);
        return [`${tagItem.label}: ${item?.name || tagItem.value}`];
    },
    [EnumFieldInputType.GEO_FENCING]: (tagItem) => {
        const locationInfo = `${i18n.t('PlaceFilter.Location')}: ${tagItem?.value?.latitude}, ${tagItem?.value?.longitude}`;
        const radiusInfo = `${i18n.t('PlaceFilter.Radius')}: ${tagItem?.value?.radius}`;
        return [locationInfo, radiusInfo];
    },
    [EnumFieldInputType.MULTIPLE_SELECT]: (tagItem) => {
        const result: string[] = [];
        tagItem?.value?.map((value) => {
            if (value) {
                result.push(value?.name || value?.id);
            }
        });
        return [`${tagItem.label}: ${result.toString()}${tagItem.endAdornmentValue ? ` (${tagItem.endAdornmentValue})` : ''}`];
    },
};
function handleTagItem<T extends EnumFieldInputType>(tagItem: Extract<IFilterField, { type: T }>) {
    try {
        const handler = groupInputHandler[tagItem.type];
        return handler(tagItem);
    } catch (e) {
        console.error(e);
        return [];
    }
}
export const getTagInputDetail = memoize((tag: ITag) => {
    const details: string[] = [];
    tag?.filterFields?.map((tagItem) => {
        if (isTagFilterHaveValue(tagItem)) {
            details.push(...handleTagItem(tagItem));
        }
        return tagItem;
    });
    return details.map((d, idx) =>
        _c(
            Typography,
            {
                key: idx,
                variant: 'subtitle2',
                style: { fontWeight: 'bold' },
            },
            d
        )
    );
});
export const getTagTitle = (tag: ITag, numOfPreviousPlaces: number) => {
    let title = '';
    let numOfPlaces = tag?.filterPlaceIds?.length || tag?.selectedPlaceIds?.length || 0;
    let count = 0;
    tag?.filterFields?.forEach((tagItem) => {
        if (isTagFilterHaveValue(tagItem) && count < 2) {
            switch (tagItem.type) {
                case EnumFieldInputType.TEXT:
                    {
                        title = `${title}${title ? ', ' : ''}${tagItem.value}`;
                        count++;
                    }
                    break;
                case EnumFieldInputType.SELECT_AREA:
                    {
                        title = `${title}${title ? ', ' : ''}${tagItem.value?.[0]?.name || ''}`;
                        count++;
                    }
                    break;
                case EnumFieldInputType.SELECT:
                    {
                        const item = tagItem.inputParameter.find((input) => input.id == tagItem.value);
                        title = `${title}${title ? ', ' : ''}${item?.name || tagItem.value}`;
                        count++;
                    }
                    break;
                case EnumFieldInputType.MULTIPLE_HIERARCHICAL_CHOICE:
                    {
                        title = `${title}${title ? ', ' : ''}${tagItem.value?.[0]?.[0]?.name || ''}`;
                        count++;
                    }
                    break;
                case EnumFieldInputType.GEO_FENCING:
                    {
                        title = `${title}${title ? ', ' : ''}R: ${tagItem.value?.radius || ''}(m)`;
                    }
                    break;
                case EnumFieldInputType.AUTO_COMPLETE:
                    {
                        const item = tagItem.inputParameter.find((input) => input.id == tagItem.value);
                        title = `${title}${title ? ', ' : ''}${item?.name || tagItem.value}`;
                        count++;
                    }
                    break;
                case EnumFieldInputType.MULTIPLE_SELECT:
                    {
                        title = `${title}${title ? ', ' : ''}${tagItem?.value?.[0]?.name || ''}`;
                        count++;
                    }
                    break;
                default:
                    break;
            }
        }
    });
    title = (title.length >= MAX_TAG_TITLE_LENGTH ? `${title.slice(0, MAX_TAG_TITLE_LENGTH - 1)}...` : title) || 'ALL';

    return _c('span', {
        children: [
            `${title}: `,
            numOfPreviousPlaces === numOfPlaces
                ? _c(CustomSpan, {
                      color: NORMAL_COLOR,
                      children: numOfPlaces,
                  })
                : numOfPreviousPlaces < numOfPlaces
                  ? _c(CustomSpan, {
                        color: POSITIVE_COLOR,
                        children: `${numOfPlaces} (+${numOfPlaces - numOfPreviousPlaces})`,
                    })
                  : _c(CustomSpan, {
                        color: NEGATIVE_COLOR,
                        children: `${numOfPlaces} (-${numOfPreviousPlaces - numOfPlaces})`,
                    }),
        ],
    });
};
