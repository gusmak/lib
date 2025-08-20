import { fireEvent, render, screen } from '@testing-library/react';
import Container from './Container';

const getRender = (props?: any) => {
    render(<Container {...props} />);
};

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Button: ({ onClick }: any) => {
        return <button onClick={(e: any) => onClick(e.target.newPage)} data-testid="PanelGroup-onClick" />;
    },
}));

jest.mock('./Panels', () => ({
    __esModule: true,
    default: () => {
        return (
            <div>
                <p data-testid="Panels">Panels</p>
            </div>
        );
    },
}));

describe('Render and Actions', () => {
    it('should render with title', () => {
        getRender();

        expect(screen.getByTestId('Panels')).toBeInTheDocument();
    });

    it('should call onPageChange', () => {
        const mockOnFilter = jest.fn();

        getRender({
            onFilter: mockOnFilter,
        });

        fireEvent.click(screen.getByTestId('PanelGroup-onClick'));
        expect(mockOnFilter).toHaveBeenCalled();
    });
});
