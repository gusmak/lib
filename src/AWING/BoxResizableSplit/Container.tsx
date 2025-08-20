import React, { CSSProperties, useRef, useState } from 'react';

export type BoxResizableSplitProps = {
    children: [React.ReactNode, React.ReactNode];
    minLeftWidth?: number;
    minRightWidth?: number;
    colResizeCursor?: CSSProperties;
    containerStyle?: CSSProperties;
};

const BoxResizableSplit = (props: BoxResizableSplitProps) => {
    const { children, minLeftWidth = 100, minRightWidth = 100, colResizeCursor, containerStyle } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const [leftWidth, setLeftWidth] = useState<number | null>(null);
    const isDragging = useRef(false);

    const onMouseDown = () => {
        document.body.style.userSelect = 'none'; // Prevent text selection during drag
        document.body.style.cursor = 'col-resize'; // Prevent text selection during drag
        isDragging.current = true;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDragging.current || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = e.clientX - containerRect.left;
        const maxLeftWidth = containerRect.width - minRightWidth;

        if (newLeftWidth >= minLeftWidth && newLeftWidth <= maxLeftWidth) {
            setLeftWidth(newLeftWidth);
        }
    };

    const onMouseUp = () => {
        document.body.style.userSelect = 'initial'; // Prevent text selection during drag
        document.body.style.cursor = 'initial'; // Prevent text selection during drag
        isDragging.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    return (
        <div ref={containerRef} style={{ display: 'flex', width: '100%', height: '100%', ...containerStyle }}>
            <div style={{ width: leftWidth ?? '50%', minWidth: minLeftWidth, overflow: 'auto' }}>{children[0]}</div>

            <div
                style={{
                    width: '5px',
                    cursor: 'col-resize',
                    background: '#eee',
                    zIndex: 1,
                    ...colResizeCursor,
                }}
                onMouseDown={onMouseDown}
            />

            <div
                style={{
                    flex: 1,
                    minWidth: minRightWidth,
                    overflow: 'auto',
                }}
            >
                {children[1]}
            </div>
        </div>
    );
};

export default BoxResizableSplit;
