import { type SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleTreeView } from '@mui/x-tree-view';
import { Grid } from '@mui/material';
import { CircularProgress } from 'AWING';
import { FilterTreeViewProps } from './types';
import ShowTreeItem from '../ShowTreeItem';
import { useFilterTreeViewStyles } from '../components/Styled';
import { getRootItem } from '../helper';

function FilterTreeView(props: FilterTreeViewProps) {
    const { t } = useTranslation();
    const { items, onDirectoryOpen, onTreeItemClick, isLoading, rootDirectoryId, sx } = props;
    const classes = useFilterTreeViewStyles();
    const [expanded, setExpanded] = useState([rootDirectoryId.toString()]);

    if (isLoading)
        return (
            <div className={classes.CircularRoot}>
                <CircularProgress />
            </div>
        );

    const handleChangeTreeView = (event: SyntheticEvent | null, itemIds: string[]) => {
        event?.preventDefault();
        for (var i = 0; i < itemIds.length; i++) {
            if (!expanded.includes(itemIds[i])) {
                onDirectoryOpen(itemIds[i]);
            }
        }
        setExpanded(itemIds);
    };

    if (items.length > 0) {
        const rootItem = getRootItem(items);

        return (
            <Grid container spacing={2}>
                <Grid
                    size={{
                        xs: 12,
                    }}
                >
                    {rootItem ? (
                        <SimpleTreeView
                            className={`${classes.root} ${classes.treeviewStyle}`}
                            onExpandedItemsChange={handleChangeTreeView}
                            expandedItems={expanded}
                            sx={sx}
                        >
                            <ShowTreeItem rootItem={rootItem} items={items} onTreeItemClick={onTreeItemClick} />
                        </SimpleTreeView>
                    ) : null}
                </Grid>
            </Grid>
        );
    } else {
        return <div style={{ textAlign: 'center' }}>{t('Common.NoData')}</div>;
    }
}

export default FilterTreeView;
