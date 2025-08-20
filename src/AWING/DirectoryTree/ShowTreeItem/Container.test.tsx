import { fireEvent, render, screen } from '@testing-library/react';
import { SimpleTreeView } from '@mui/x-tree-view';
import { getChildrentByParentPath } from '../helper';
import Container from './Container';
import { ShowTreeItemProps } from './types';

const initProps: ShowTreeItemProps = {
    items: [],
    onTreeItemClick: () => {},
    rootItem: {
        value: 0,
        text: 'text',
        actions: [],
        level: 0,
    },
    loading: false,
};

const Component = (props?: ShowTreeItemProps) => {
    render(
        <SimpleTreeView>
            <Container {...initProps} {...props} />
        </SimpleTreeView>
    );
};

jest.mock('../TreeItemWithAction', () => ({
    __esModule: true,
    default: (props: any) => {
        return (
            <div>
                <p>TreeItemWithAction</p>
                <p data-testid={`TreeItemWithAction-labelText-${props.itemId}`}>{props.labelText}</p>
                <button data-testid={`TreeItemWithAction-onTreeItemClick-${props.itemId}`} onClick={props.onTreeItemClick} />
                <div data-testid={`TreeItemWithAction-actions-${props.itemId}`}>{props.actions}</div>
                {props.children}
            </div>
        );
    },
}));

jest.mock('../helper', () => ({
    getChildrentByParentPath: jest.fn(),
}));

describe('Render', () => {
    beforeEach(() => {
        (getChildrentByParentPath as jest.Mock).mockReturnValue([]);
    });

    it('should render labelText', () => {
        Component({
            ...initProps,
            rootItem: {
                value: 0,
                text: 'labelText',
                actions: [],
                level: 0,
            },
            items: [
                {
                    parentObjectId: 0,
                    value: 1,
                    text: 'chil 1',
                    actions: [],
                    level: 1,
                    directoryPath: '.0.1.',
                    order: 1,
                },
                {
                    parentObjectId: 0,
                    value: 2,
                    text: 'child 2',
                    actions: [],
                    level: 1,
                    directoryPath: '.0.2.',
                    order: 1,
                },
            ],
        });

        expect(screen.queryByTestId('TreeItemWithAction-labelText-0')).toHaveTextContent('labelText');
    });

    it('should render with children', () => {
        Component({
            ...initProps,
            rootItem: {
                value: 0,
                text: 'labelText',
                actions: [<div key="0">action</div>],
                level: 0,
                objectId: 0,
            },
            items: [
                {
                    parentObjectId: 0,
                    value: 1,
                    text: 'chil 1',
                    actions: [],
                    level: 1,
                    directoryPath: '.0.1.',
                    order: 2,
                },
                {
                    parentObjectId: 0,
                    value: 2,
                    text: 'child 2',
                    actions: [],
                    level: 1,
                    order: 1,
                    directoryPath: '.0.2.',
                },
            ],
        });

        expect(screen.queryByTestId('TreeItemWithAction-labelText-0')).toHaveTextContent('labelText');
    });

    it('should render with children order', () => {
        Component({
            ...initProps,
            rootItem: {
                value: 0,
                text: 'labelText',
                actions: [<div key="0">action</div>],
                level: 0,
                objectId: 0,
            },
            items: [
                {
                    parentObjectId: 0,
                    value: 1,
                    text: 'chil 1',
                    actions: [],
                    level: 1,
                    directoryPath: '.0.1.',
                    order: 1,
                },
                {
                    parentObjectId: 0,
                    value: 2,
                    text: 'child 2',
                    actions: [],
                    level: 1,
                    directoryPath: '.0.2.',
                },
            ],
        });

        expect(screen.queryByTestId('TreeItemWithAction-labelText-0')).toHaveTextContent('labelText');
    });
});

describe('Actions', () => {
    it('should call onTreeItemClick', () => {
        const mockOnTreeItemClick = jest.fn();
        Component({
            ...initProps,
            rootItem: {
                value: 0,
                text: 'labelText',
                actions: [],
                level: 0,
            },
            onTreeItemClick: mockOnTreeItemClick,
        });

        fireEvent.click(screen.getByTestId('TreeItemWithAction-onTreeItemClick-0'));
        expect(mockOnTreeItemClick).toHaveBeenCalledWith(0);
    });
});
