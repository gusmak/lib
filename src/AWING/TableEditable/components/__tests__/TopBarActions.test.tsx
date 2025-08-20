import { render, fireEvent } from '@testing-library/react';
import { Clear, Edit } from '@mui/icons-material';
import TopBarActions from '../TopBarActions';

describe('TopBarActions', () => {
    const defaultSelected = [0];
    const mockEditAction = jest.fn();
    const mockClearAction = jest.fn();
    const defaultSelectionActions = [
        { icon: <Edit />, tooltipTitle: 'Edit', action: mockEditAction },
        { icon: <Clear />, tooltipTitle: 'Clear', action: mockClearAction },
    ];

    it('should render without crashing', () => {
        const { container } = render(
            <TopBarActions selected={defaultSelected} selectionActions={defaultSelectionActions} />
        );
        expect(container).toBeTruthy();
    });

    it('should render selection actions', () => {
        const { getByTestId } = render(
            <TopBarActions selected={defaultSelected} selectionActions={defaultSelectionActions} />
        );
        const editButton = getByTestId('EditIcon');
        const clearButton = getByTestId('ClearIcon');
        expect(editButton).toBeTruthy();
        expect(clearButton).toBeTruthy();
        fireEvent.click(editButton);
        expect(mockEditAction).toHaveBeenCalled();
        fireEvent.click(clearButton);
        expect(mockClearAction).toHaveBeenCalled();
    });
});
