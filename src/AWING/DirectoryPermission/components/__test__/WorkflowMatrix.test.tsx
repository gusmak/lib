import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Container, { type OwnProps } from '../WorkflowMatrix';
import { getMatrixRows } from '../../utils';

const initProps: OwnProps = {
    explicitMatrices: [],
    inheritMatrices: [],
    onMatrixPermissionsChange: jest.fn(),
    workflow: {},
};
const getRender = (props?: Partial<OwnProps>) => {
    return render(<Container {...initProps} {...props} />);
};

// #region Mocks
jest.mock('@mui/icons-material', () => ({
    ArrowRightAlt: () => <p data-testid="Icon-ArrowRightAlt">ArrowRightAlt</p>,
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Checkbox: (props: any) => (
        <div>
            <p data-testid="Material-Checkbox-header">Material Checkbox</p>
            <button data-testid={`Material-Checkbox-onChange`} onClick={(e: any) => props?.onChange(e.target.matrixId)} />
        </div>
    ),
}));

jest.mock('../../utils', () => ({
    getMatrixRows: jest.fn(),
}));
// #endregion

beforeEach(() => {
    (getMatrixRows as jest.Mock).mockReturnValue([]);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('render', () => {
    it('should render', () => {
        getRender();
        expect(screen.getByText('DirectoryManagement.WorkflowMatrixPermissions'));
    });

    it('should render matrix', () => {
        (getMatrixRows as jest.Mock).mockReturnValue([
            {
                id: 1,
                inheritChecked: false,
                explicitChecked: false,
                stateStart: 'Start',
                stateEnd: 'End',
            },
        ]);
        getRender();
        expect(screen.getByTestId('Icon-ArrowRightAlt'));
    });
});

describe('Actions', () => {
    it('should call onMatrixPermissionsChange and return empty', async () => {
        (getMatrixRows as jest.Mock).mockReturnValue([
            {
                id: 1,
                inheritChecked: false,
                explicitChecked: false,
                stateStart: 'Start',
                stateEnd: 'End',
            },
        ]);
        getRender({
            explicitMatrices: [1],
        });
        fireEvent.click(screen.getAllByTestId('Material-Checkbox-onChange')[1], {
            target: {
                matrixId: 1,
            },
        });
        await waitFor(() => {
            expect(initProps.onMatrixPermissionsChange).toHaveBeenCalledWith([]);
        });
    });

    it('should call onMatrixPermissionsChange', async () => {
        (getMatrixRows as jest.Mock).mockReturnValue([
            {
                id: 1,
                inheritChecked: false,
                explicitChecked: false,
                stateStart: 'Start',
                stateEnd: 'End',
            },
        ]);
        getRender({
            explicitMatrices: [2],
        });
        fireEvent.click(screen.getAllByTestId('Material-Checkbox-onChange')[1], {
            target: {
                matrixId: 1,
            },
        });
        await waitFor(() => {
            expect(initProps.onMatrixPermissionsChange).toHaveBeenCalledWith([2, 1]);
        });
    });
});
