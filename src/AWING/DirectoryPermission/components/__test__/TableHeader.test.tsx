import { render, screen } from '@testing-library/react';
import TableHeader, { getCellWidth, type OwnProps } from '../TableHeader';

// #region Render
const initProps: OwnProps = {
    headCells: [],
};
const getRender = (props?: Partial<OwnProps>) => {
    render(<TableHeader {...initProps} {...props} />);
};
// #endregion

// #region Mock
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    TableRow: (props: any) => (
        <div>
            <p data-testid={`TableRow-header`}>TableRow</p>
            {props?.children}
        </div>
    ),
    TableCell: (props: any) => (
        <div>
            <p data-testid={`TableCell-header`}>TableCell</p>
            <p data-testid={`TableCell-theme-spacing`}>{props?.sx({ spacing: () => '8px' }).paddingLeft}</p>
            {props?.children}
        </div>
    ),
}));

// #endregion

describe('render', () => {
    it('should render TableRow', () => {
        getRender();

        expect(screen.getByTestId('TableRow-header')).toBeInTheDocument();
    });

    it('should render TableCell', () => {
        getRender({
            headCells: [
                {
                    id: '1',
                    label: 'demo 1',
                    disablePadding: false,
                    numeric: false,
                    explain: 'demo 1',
                },
                {
                    id: '2',
                    label: 'demo 2',
                    disablePadding: true,
                    numeric: true,
                    explain: 'demo 2',
                },
            ],
        });

        expect(screen.getByTestId('TableRow-header')).toBeInTheDocument();
    });
});

describe('getCellWidth', () => {
    it('should return 5%', () => {
        const result = getCellWidth('stt');
        expect(result).toBe('5%');
    });

    it('should return 18%', () => {
        const result = getCellWidth('authenName');
        expect(result).toBe('18%');
    });

    it('should return 16%', () => {
        const result = getCellWidth('readAndExecute');
        expect(result).toBe('16%');
    });

    it('should return 10%', () => {
        const result = getCellWidth('demo');
        expect(result).toBe('10%');
    });
});
