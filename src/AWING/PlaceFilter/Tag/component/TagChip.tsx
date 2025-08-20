import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { FormatListNumbered as FormatListNumberedIcon } from '@mui/icons-material';
import { Chip, Tooltip, Typography } from '@mui/material';
import { getTagInputDetail, getTagTitle } from './utils';
import type { ITag } from '../../interface';

interface Props {
    tagItem: ITag;
    isFocused: boolean;
    numOfPreviousPlaces: number;
    onDeleteTag: () => void;
    onClickTag: () => void;
}

export default function TagChip(props: Props) {
    const { t } = useTranslation();
    const { tagItem, isFocused, numOfPreviousPlaces, onDeleteTag, onClickTag } = props;

    return (
        <Tooltip
            title={
                <Fragment>
                    <div style={{ display: 'flex' }}>
                        <FormatListNumberedIcon />
                        <Typography color="inherit">
                            {t('PlaceFilter.SelectedByFilter')} : {tagItem.filterPlaceIds?.length || tagItem.selectedPlaceIds?.length}
                        </Typography>
                    </div>
                    <div style={{ padding: '16px' }}>{getTagInputDetail(tagItem)}</div>
                </Fragment>
            }
        >
            <Chip
                style={{ margin: '10px' }}
                clickable
                variant={isFocused ? 'filled' : 'outlined'}
                avatar={<FormatListNumberedIcon />}
                label={getTagTitle(tagItem, numOfPreviousPlaces)}
                onDelete={onDeleteTag}
                onClick={onClickTag}
                key={tagItem.selectedPlaceIds?.join('')}
            />
        </Tooltip>
    );
}
