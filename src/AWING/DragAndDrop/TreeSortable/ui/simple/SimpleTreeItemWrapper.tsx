import clsx from 'clsx';
import React, { forwardRef } from 'react';
import type { TreeItemComponentProps } from '../../types';
import './SimpleTreeItemWrapper.css';
import { IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

export const SimpleTreeItemWrapper = forwardRef<HTMLDivElement, React.PropsWithChildren<TreeItemComponentProps<{}>>>(
    (props, ref) => {
        const {
            clone,
            depth,
            disableSelection,
            disableInteraction,
            disableSorting = false,
            ghost,
            handleProps,
            indentationWidth,
            indicator,
            collapsed,
            onCollapse,
            onRemove,
            item,
            wrapperRef,
            style,
            hideCollapseButton,
            childCount,
            manualDrag,
            showDragHandle = true,
            disableCollapseOnItemClick,
            isLast,
            parent,
            className,
            contentClassName,
            isOver,
            isOverParent,
            ...rest
        } = props;

        return (
            <li
                ref={wrapperRef}
                {...rest}
                className={clsx(
                    'dnd-sortable-tree_simple_wrapper',
                    clone && 'dnd-sortable-tree_simple_clone',
                    ghost && 'dnd-sortable-tree_simple_ghost',
                    disableSelection && 'dnd-sortable-tree_simple_disable-selection',
                    disableInteraction && 'dnd-sortable-tree_simple_disable-interaction',
                    className
                )}
                style={{
                    ...style,
                    paddingLeft: clone ? indentationWidth : indentationWidth * depth,
                    borderTop: depth === 0 ? '1px solid #e6e6e6' : 'none',
                }}
            >
                <div
                    className={clsx('dnd-sortable-tree_simple_tree-item', contentClassName)}
                    ref={ref}
                    style={{ padding: 1, border: 'none' }}
                    {...(manualDrag ? undefined : handleProps)}
                    onClick={disableCollapseOnItemClick ? undefined : onCollapse}
                >
                    {showDragHandle && !disableSorting && (
                        <div className={'dnd-sortable-tree_simple_handle'} {...handleProps} />
                    )}
                    {props.children}
                    {!manualDrag && !hideCollapseButton && !!onCollapse && !!childCount && (
                        <IconButton
                            size="small"
                            sx={{ padding: '3px' }}
                            onClick={(e) => {
                                if (!disableCollapseOnItemClick) {
                                    return;
                                }

                                e.preventDefault();
                                onCollapse();
                            }}
                            // className={clsx(
                            //     'dnd-sortable-tree_simple_tree-item-collapse_button',
                            //     collapsed && 'dnd-sortable-tree_folder_simple-item-collapse_button-collapsed'
                            // )}
                        >
                            {collapsed ? <KeyboardArrowDown sx={{ fontSize: '1.3em' }} /> : <KeyboardArrowUp sx={{ fontSize: '1.3em' }} />}
                        </IconButton>
                    )}
                </div>
            </li>
        );
    }
) as <T>(
    p: React.PropsWithChildren<TreeItemComponentProps<T> & React.RefAttributes<HTMLDivElement>>
) => React.ReactElement;
