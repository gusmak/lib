import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { directoriesState } from '../Atoms';
import TreeView, { OwnProps } from './Container';

const mockOnTreeItemClick = jest.fn();
const mockOnDirectoryOpen = jest.fn();
const mockDeleteDirectory = jest.fn();

const initProps: OwnProps = {
    childDirectories: [],
    onTreeItemClick: mockOnTreeItemClick,
    onDirectoryOpen: mockOnDirectoryOpen,
    deleteDirectory: mockDeleteDirectory,
    loading: false,
};

const getComponent = (props?: OwnProps) => {
    const initialRecoilState = ({ set }: any) => {
        set(directoriesState, [
            {
                id: 1,
                name: 'Demo schema 1',
                parentObjectId: 0,
                order: 1,
                level: 1,
                isSystem: false,
            },
            {
                id: 2,
                name: 'Demo schema 2',
                parentObjectId: 0,
                order: 1,
                level: 1,
                isSystem: false,
            },
            {
                id: 3,
                parentObjectId: 1,
                order: 1,
                level: 2,
                isSystem: false,
            },
        ]);
    };

    render(
        <Provider initializeState={initialRecoilState}>
            <TreeView {...initProps} {...props} />
        </Provider>
    );
};

jest.mock('AWING/DirectoryTree', () => ({
    FilterTreeView: (props: any) => (
        <div>
            <p data-testid="FilterTreeView-label">FilterTreeView</p>
            <p>{props.rootDirectoryId}</p>
            <button data-testid={`FilterTreeView-onDirectoryOpen`} onClick={(e: any) => props.onDirectoryOpen(e.target.id)} />
            <button data-testid={`FilterTreeView-onTreeItemClick `} onClick={(e: any) => props.onTreeItemClick(e.target.id)} />

            <div>
                {props.items.map((item: any) => (
                    <div key={item.value}>
                        <p>{item.value}</p>
                        <p>{item.text}</p>
                        <p>{item.parentDirectoryId}</p>
                        <p>{item.order}</p>
                        <p>{item.level}</p>
                        {item.actions}
                    </div>
                ))}
            </div>
        </div>
    ),
}));

jest.mock('../components/DirectoryAction', () => ({
    __esModule: true,
    default: (props: any) => (
        <div>
            <p data-testid="DirectoryAction-label">DirectoryAction</p>
            <p data-testid="DirectoryAction-id">{props.id}</p>
            <p data-testid="DirectoryAction-isSystem">{props.isSystem}</p>
            <button
                data-testid={`DirectoryAction-deleteDirectory-${props.id}`}
                onClick={(e: any) => props.deleteDirectory(e.target.id, e.target.parentObjectId)}
            />
        </div>
    ),
}));

describe('TreeView', () => {
    it('renders', () => {
        getComponent();
        expect(screen.queryByTestId('FilterTreeView-label')).toHaveTextContent('FilterTreeView');
    });
});

describe('Actions', () => {
    it('should call FilterTreeView onDirectoryOpen', () => {
        getComponent();

        fireEvent.click(screen.getByTestId('FilterTreeView-onDirectoryOpen'), {
            target: { id: 1 },
        });

        expect(mockOnDirectoryOpen).toHaveBeenCalledWith(1);
    });

    it('should call FilterTreeView onTreeItemClick', () => {
        getComponent();

        fireEvent.click(screen.getByTestId('FilterTreeView-onTreeItemClick'), {
            target: { id: 1 },
        });

        expect(mockOnTreeItemClick).toHaveBeenCalledWith(1);
    });

    it('should call onTreeItemClick', () => {
        getComponent({
            ...initProps,
        });

        fireEvent.click(screen.getByTestId('DirectoryAction-deleteDirectory-2'), {
            target: { id: 2, parentObjectId: 0 },
        });

        expect(mockDeleteDirectory).toHaveBeenCalledWith({ id: 2, parentObjectId: 0 });
    });
});
