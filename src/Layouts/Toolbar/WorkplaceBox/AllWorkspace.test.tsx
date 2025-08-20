import { fireEvent, render, screen } from '@testing-library/react';
import AllWorkSpace, { type AllWorkSpaceProps } from './AllWorkSpace';
import { changeToAlias, offlinePaginate } from 'Helpers';

jest.mock('AWING', () => ({
    changeToAlias: jest.fn(),
    offlinePaginate: jest.fn(),
}));

jest.mock('AWING', () => ({
    Drawer: ({ children }: any) => (
        <div>
            <p data-testid="Drawer" />
            {children}
        </div>
    ),
    PageManagement: ({ onChangeQueryInput, getRowId, onRowClick }: any) => (
        <div>
            <p data-testid="PageManagement" />
            <button
                data-testid="changedQueryInput"
                onClick={() => {
                    onChangeQueryInput({
                        searchString: '1',
                        pageIndex: 0,
                        pageSize: 10,
                    });
                }}
            />
            <button data-testid="PageManagement-onRowClick" onClick={(e: any) => onRowClick(e.target.id)} />
        </div>
    ),
}));

const getRender = (props?: Partial<AllWorkSpaceProps>) => {
    render(<AllWorkSpace allWorkSpace={[]} onClose={() => {}} setCurrentWorkspace={() => {}} {...props} />);
};

describe('Render', () => {
    it('should render Drawer', () => {
        getRender({
            isOpen: true,
        });

        expect(screen.getByTestId('Drawer')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should call onChangeQueryInput', () => {
        getRender({
            isOpen: true,
        });

        screen.getByTestId('changedQueryInput').click();
    });

    it('should call PageManagement click', () => {
        getRender({
            isOpen: true,
            allWorkSpace: [],
        });

        fireEvent.click(screen.getByTestId('PageManagement-onRowClick'), {
            target: {
                id: 1,
            },
        });
    });
});
