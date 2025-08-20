import { render, screen } from '@testing-library/react';
import FunctionGrid from './FunctionGrid';

const mockTheme = {
    spacing: (value: number) => `${value * 8}px`,
};

jest.mock('@mui/material', () => ({
    Grid: ({ sx, children }: { sx?: any; children: React.ReactNode }) => {
        const styles =
            typeof sx === 'object'
                ? Object.entries(sx).reduce((acc: any, [key, value]) => {
                      acc[key] = typeof value === 'function' ? value(mockTheme) : value;
                      return acc;
                  }, {})
                : {};

        return (
            <div data-testid="grid" style={styles}>
                {children}
            </div>
        );
    },
    Typography: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Paper: ({ children }: { children: React.ReactNode }) => <div data-testid="paper">{children}</div>,
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('FunctionGrid Component', () => {
    it('renders function list header', () => {
        render(<FunctionGrid />);
        expect(screen.getByText('Template.Label.FunctionList')).toBeInTheDocument();
    });

    it('renders all functions', () => {
        render(<FunctionGrid />);

        const functionNames = ['exist', 'now', 'dateToString', 'count', 'any'];
        functionNames.forEach((name) => {
            expect(screen.getByText(name)).toBeInTheDocument();
        });
    });

    it('renders function parameters correctly', () => {
        render(<FunctionGrid />);

        expect(screen.getByText('fieldDefinition')).toBeInTheDocument();
        expect(screen.getByText('date')).toBeInTheDocument();
        expect(screen.getByText('format')).toBeInTheDocument();
        expect(screen.getAllByText('arr')).toHaveLength(2);
    });

    it('renders function descriptions', () => {
        render(<FunctionGrid />);

        expect(screen.getByText('Template.FunctionDescription.exist')).toBeInTheDocument();
        expect(screen.getByText('Template.FunctionDescription.now')).toBeInTheDocument();
        expect(screen.getByText('Template.FunctionDescription.dateToString')).toBeInTheDocument();
    });

    it('renders function example when available', () => {
        render(<FunctionGrid />);
        expect(screen.getByText('Template.FunctionExample.any')).toBeInTheDocument();
    });

    it('renders in correct grid layout', () => {
        render(<FunctionGrid />);
        const grids = screen.getAllByTestId('grid');
        expect(grids.length).toBeGreaterThan(0);
    });
});
