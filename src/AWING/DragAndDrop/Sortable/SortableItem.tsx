import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconButton } from '@mui/material';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';

export type SortableItemProps = {
    id: number | string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
};

const SortableItem = (props: SortableItemProps) => {
    const { id } = props;
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        listStyle: 'none',
        ...props.style,
    };

    return (
        <li style={style}>
            <IconButton ref={setNodeRef} {...attributes} {...listeners} style={{ cursor: 'move' }}>
                <DragIndicatorIcon />
            </IconButton>
            {props?.children}
        </li>
    );
};

export default SortableItem;
