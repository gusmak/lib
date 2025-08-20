import { BrowserRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import NavLink from '../NavLink';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    NavLink: (props: any) => {
        props.style(
            { isActive: true } // Mocking isActive to always return true for testing
        );
        return <div data-testid="NavLink" />;
    },
}));

describe('Render', () => {
    it('Should render', () => {
        render(
            <BrowserRouter>
                <NavLink to={'/test'} />
            </BrowserRouter>
        );
        expect(screen.queryByTestId('NavLink')).toBeInTheDocument();
    });
});
