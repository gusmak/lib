import { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

import SortableItem from './SortableItem';

export type SortableProps = {
    items: number[];
    direction?: 'horizontal' | 'vertical';
    itemStyle?: React.CSSProperties;
    onDragEnd?: (event: DragEndEvent) => void;
    onSort?: (items: number[]) => void;
};

const Sortable = (props: SortableProps) => {
    const { direction = 'vertical', onDragEnd, onSort } = props;

    const [items, setItems] = useState(props.items);

    const handleDragEnd = (event: DragEndEvent) => {
        if (event.active && event.over && event.active.id !== event.over.id) {
            const activeIndex = items.findIndex((id) => id === event.active.id);
            const overIndex = items.findIndex((id) => id === event.over?.id);

            const result = [...items]; // sao mảng để tránh thay đổi gốc
            const [movedItem] = result.splice(activeIndex, 1); // lấy ra phần tử
            result.splice(overIndex, 0, movedItem); // chèn vào vị trí mới

            setItems(result);

            onDragEnd && onDragEnd(event); // gọi hàm callback nếu có
            onSort && onSort(result); // gọi hàm callback nếu có
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={items}>
                <ul
                    style={{
                        display: 'flex',
                        flexDirection: direction === 'horizontal' ? 'row' : 'column',
                        listStyleType: 'none',
                        padding: '8px',
                        margin: 0,
                    }}
                >
                    {items.map((id: number) => (
                        <SortableItem key={id} id={id} style={props.itemStyle}>
                            {id}
                        </SortableItem>
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
};

export default Sortable;
