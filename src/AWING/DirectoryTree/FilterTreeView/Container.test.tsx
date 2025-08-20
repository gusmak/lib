import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import Container from './Container';
import { type FilterTreeViewProps } from './types';

const initProps: FilterTreeViewProps = {
    items: [],
    onDirectoryOpen: () => {},
    onTreeItemClick: () => {},
    rootDirectoryId: '',
};
const Component = (props?: FilterTreeViewProps) => {
    render(<Container {...initProps} {...props} />);
};

jest.mock('AWING', () => ({
    CircularProgress: () => <div>CircularProgress</div>,
}));

// #region mock ShowTreeItem
const mockOnTreeItemClick = jest.fn();
jest.mock('../ShowTreeItem', () => ({
    __esModule: true,
    default: (props: any) => {
        const { onTreeItemClick = mockOnTreeItemClick } = props;

        return (
            <div>
                <p>ShowTreeItem</p>
                <button
                    data-testid="ShowTreeItem-onTreeItemClick"
                    onClick={(e: any) => {
                        onTreeItemClick(e.target.id);
                    }}
                />
            </div>
        );
    },
}));
// #endregion

// #region mock @mui/x-tree-view
const mockOnExpandedItemsChange = jest.fn();
jest.mock('@mui/x-tree-view', () => ({
    SimpleTreeView: (props: any) => {
        const { expandedItems = [], onExpandedItemsChange = mockOnExpandedItemsChange } = props;

        return (
            <div>
                <p>SimpleTreeView</p>
                <div>
                    {expandedItems.map((id: string) => (
                        <p key={id} data-testid={`expandedItem-${id}`}>
                            {id}
                        </p>
                    ))}
                </div>
                <button
                    data-testid="SimpleTreeView-onExpandedItemsChange"
                    onClick={(e: any) => {
                        onExpandedItemsChange(e, e.target.itemIds);
                    }}
                />
                {props.children}
            </div>
        );
    },
}));
// #endregion

describe('Render', () => {
    it('should render nodata', () => {
        Component({
            ...initProps,
        });
        expect(screen.queryByText('Common.NoData')).toBeInTheDocument();
    });

    it('should render SimpleTreeView', () => {
        Component({
            ...initProps,
            items: [
                {
                    text: 'item 1',
                    value: '1',
                },
                {
                    text: 'item 2',
                    value: '2',
                },
                {
                    text: 'item 3',
                    value: '3',
                },
            ],
            rootDirectoryId: '1',
        });
        expect(screen.queryByText('SimpleTreeView')).toBeInTheDocument();
    });

    it('should render loading', () => {
        Component({
            ...initProps,
            isLoading: true,
        });
        expect(screen.queryByText('CircularProgress')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should call SimpleTreeView onExpandedItemsChange', () => {
        Component({
            ...initProps,
            items: [
                {
                    text: 'item 1',
                    value: '1',
                },
                {
                    text: 'item 2',
                    value: '2',
                },
                {
                    text: 'item 3',
                    value: '3',
                },
            ],
            rootDirectoryId: '1',
        });

        const event = {
            preventDefault: jest.fn(),
            target: {
                itemIds: ['1', '2'],
            },
        };
        fireEvent.click(screen.getByTestId('SimpleTreeView-onExpandedItemsChange'), {
            event,
            target: event.target,
        });

        waitFor(() => {
            expect(mockOnExpandedItemsChange).toHaveBeenCalledWith({
                event,
                target: event.target,
            });
        });
    });

    it('should call ShowTreeItem onTreeItemClick', () => {
        Component({
            ...initProps,
            items: [
                {
                    text: 'item 1',
                    value: '1',
                },
                {
                    text: 'item 2',
                    value: '2',
                },
                {
                    text: 'item 3',
                    value: '3',
                },
            ],
            rootDirectoryId: '1',
        });

        fireEvent.click(screen.getByTestId('ShowTreeItem-onTreeItemClick'), {
            target: {
                id: '1',
            },
        });

        waitFor(() => {
            expect(mockOnTreeItemClick).toHaveBeenCalledWith({
                target: {
                    id: '1',
                },
            });
        });
    });
});
