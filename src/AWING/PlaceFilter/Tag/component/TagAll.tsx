import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PlaylistAddCheck as PlaylistAddCheckIcon } from '@mui/icons-material';
import { Chip, Tooltip, Typography } from '@mui/material';
import { NEGATIVE_COLOR, NORMAL_COLOR, POSITIVE_COLOR } from 'Commons/Constant';
import { ITagAll } from '../../interface';
import { memoize } from 'lodash';
import { CustomSpan } from './utils';

interface Props {
    isFocused: boolean;
    tagsAll: ITagAll;
    snapTagsAll: ITagAll;
    onClickTagAll: () => void;
}

const countAllSelected = memoize((tag?: ITagAll) => {
    const selectedPlaceIds = tag?.selectedPlaceIds || [];
    const filterPlaceIds = tag?.filterPlaceIds || [];
    const mergSelected = [...selectedPlaceIds, ...filterPlaceIds];
    return mergSelected?.filter((item, index) => mergSelected.indexOf(item) === index).length;
});
const countDuplicatePlace = memoize((tagsAll: ITagAll) => {
    const merge = [...(tagsAll?.selectedPlaceIds || []), ...(tagsAll?.filterPlaceIds || [])];
    return merge.filter((item, index) => merge.indexOf(item) !== index).length;
});
export default function TagAll(props: Props) {
    const { t } = useTranslation();
    const { tagsAll, snapTagsAll, isFocused, onClickTagAll } = props;

    const tagAllTitle = useMemo(() => {
        const snapNumOfPlaces = countAllSelected(snapTagsAll);
        const numOfPlaces = countAllSelected(tagsAll);

        return (
            <span>
                {t('PlaceFilter.TotalSelected')}:{' '}
                {snapNumOfPlaces === numOfPlaces ? (
                    <CustomSpan color={NORMAL_COLOR}>{numOfPlaces}</CustomSpan>
                ) : snapNumOfPlaces < numOfPlaces ? (
                    <CustomSpan color={POSITIVE_COLOR}>{`${numOfPlaces} (+${numOfPlaces - snapNumOfPlaces})`}</CustomSpan>
                ) : (
                    <CustomSpan color={NEGATIVE_COLOR}>{`${numOfPlaces} (-${snapNumOfPlaces - numOfPlaces})`}</CustomSpan>
                )}
            </span>
        );
    }, [t, snapTagsAll, tagsAll]);

    return (
        <Tooltip
            title={
                <Fragment>
                    <div style={{ display: 'flex' }}>
                        <PlaylistAddCheckIcon />
                        <Typography color="inherit">
                            {t('PlaceFilter.TotalSelected')}: {tagsAll.filterPlaceIds?.length || tagsAll.selectedPlaceIds?.length}
                        </Typography>
                    </div>
                    <div style={{ padding: '16px' }}>
                        <Typography color="inherit">
                            {t('PlaceFilter.DuplicatePlace')}: {countDuplicatePlace(tagsAll)}
                        </Typography>
                    </div>
                </Fragment>
            }
        >
            <Chip
                style={{ margin: '10px' }}
                clickable
                variant={isFocused ? 'filled' : 'outlined'}
                avatar={<PlaylistAddCheckIcon />}
                label={tagAllTitle}
                onClick={onClickTagAll}
            />
        </Tooltip>
    );
}
