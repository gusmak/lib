import { render, screen } from '@testing-library/react';
import HeaderMenu from '../HeaderMenu';

jest.mock('@mui/icons-material', () => ({
    ArrowDropDown: () => <div data-testid="ArrowDropDown" />,
    ArrowRight: () => <div data-testid="ArrowRight" />,
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    ListItemText: (props: any) => <div data-testid="ListItemText">{props?.primary}</div>,
}));

describe('Render', () => {
    it('Should render', () => {
        render(
            <HeaderMenu
                route={{
                    key: 'test',
                    title: 'Test',
                    subRoutes: [
                        {
                            key: 'test child',
                            title: 'Test Child',
                        },
                    ],
                }}
                open="test"
            />
        );
        expect(screen.queryByText('Test')).toBeInTheDocument();
        expect(screen.queryByTestId('ArrowDropDown')).toBeInTheDocument();
    });

    it('Should render without router key', () => {
        render(
            <HeaderMenu
                route={{
                    key: 'test',
                    title: 'Test',
                    subRoutes: [
                        {
                            key: 'test child',
                            title: 'Test Child',
                        },
                    ],
                }}
                open="test 1"
            />
        );
        expect(screen.queryByText('Test')).toBeInTheDocument();
        expect(screen.queryByTestId('ArrowRight')).toBeInTheDocument();
    });

    it('Should render icon', () => {
        render(
            <HeaderMenu
                route={{
                    key: 'test',
                    title: 'Test',
                    icon: () => <div data-testid="Icon" />,
                    subRoutes: [
                        {
                            key: 'test child',
                            title: 'Test Child',
                        },
                    ],
                }}
                open="test 1"
            />
        );
        expect(screen.queryByTestId('Icon')).toBeInTheDocument();
    });
});
