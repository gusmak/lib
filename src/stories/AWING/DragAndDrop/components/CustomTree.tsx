import { forwardRef, MouseEvent, useState } from 'react';
import { Popover, Stack } from '@mui/material';
import { SimpleTreeItemWrapper, TreeItemComponentProps } from 'AWING/DragAndDrop/TreeSortable';

export enum ReportField {
    MediaPlan = 'MEDIA_PLAN',
    Month = 'MONTH',
    Reconciliation = 'RECONCILIATION',
    ReconciliationStatus = 'RECONCILIATION_STATUS',
    Supplier = 'SUPPLIER',
    User = 'USER',
    Year = 'YEAR',
}

export const IS_COLUMN_VIEW = '_isColumnView';
export const IS_GROUP = '_isGroup';
export const IS_SUMMARIZE = '_isSummarize';
export const IS_FILTER = '_isFilter';

export type MinimalTreeItemData = {
    value?: string | number;
    onDelete?: () => void;
};

/**
 * CustomTreeItem là một component được sử dụng để hiển thị 1 Item trong danh sách tree
 * Với cấu trúc <prefix><label><suffix>
 */
export const CustomTreeItem = forwardRef<HTMLDivElement, TreeItemComponentProps<MinimalTreeItemData>>((props, ref) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const popoverId = open ? props.item.id : undefined;

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpen = (event: MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <SimpleTreeItemWrapper {...props} ref={ref}>
            <Stack
                direction="row"
                onClick={handleOpen}
                style={{ flex: 1, justifyContent: 'space-between', width: 'calc(100% - 60px)', position: 'relative' }}
            >
                <Stack direction="row" alignItems="center" flex={1} maxWidth="100%">
                    {props.item?.prefix}
                    <div
                        style={{
                            display: 'flex',
                            whiteSpace: 'nowrap',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {props.item?.label ?? props.item.value}
                    </div>
                </Stack>
                <Stack>{props.item?.suffix}</Stack>
            </Stack>

            {props.item?.properties && open && (
                <Popover
                    id={popoverId?.toString()}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                >
                    {props.item?.properties}
                </Popover>
            )}
        </SimpleTreeItemWrapper>
    );
});
