import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Container, { OwnProps } from './Container';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const renderComponent = (props: OwnProps) => {
    return render(
        <MemoryRouter>
            <Container {...props} />
        </MemoryRouter>
    );
};

describe('Container', () => {
    const defaultProps: OwnProps = {
        id: 1,
        isSystem: false,
        deleteDirectory: jest.fn(),
    };

    it('should render permission and create buttons', () => {
        const { getByTestId } = renderComponent(defaultProps);

        expect(getByTestId('action-permission')).toBeInTheDocument();
        expect(getByTestId('action-create')).toBeInTheDocument();
    });

    it('should render edit and delete buttons when isSystem is false', () => {
        const { getByTestId } = renderComponent(defaultProps);

        expect(getByTestId('action-edit')).toBeInTheDocument();
        expect(getByTestId('action-delete')).toBeInTheDocument();
    });

    it('should not render edit and delete buttons when isSystem is true', () => {
        const { queryByTestId } = renderComponent({ ...defaultProps, isSystem: true });

        expect(queryByTestId('action-edit')).not.toBeInTheDocument();
        expect(queryByTestId('action-delete')).not.toBeInTheDocument();
    });

    it('should call deleteDirectory when delete button is clicked', () => {
        const { getByTestId } = renderComponent(defaultProps);

        fireEvent.click(getByTestId('action-delete'));
        expect(defaultProps.deleteDirectory).toHaveBeenCalled();
    });
});
