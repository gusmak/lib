import { fireEvent, render, screen } from '@testing-library/react';
import NavDrawer from '../index';

jest.mock('react-router', () => ({
    Link: (props: any) => <a data-testid="Router-Link">{props?.children}</a>,
    matchPath: () => true,
}));

jest.mock('@mui/icons-material', () => ({
    ChevronLeft: () => <div data-testid="ChevronLeft" />,
    ChevronRight: () => <div data-testid="ChevronRight" />,
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    IconButton: (props: any) => (
        <div data-testid="IconButton">
            {props?.children}
            <button data-testid="IconButton-onClick" onClick={props?.onClick} />,
        </div>
    ),
}));

jest.mock('../MenuNav', () => ({
    __esModule: true,
    default: (props: any) => (
        <div data-testid="MenuNav">
            <button data-testid="HeaderMenu-handleClick" onClick={props?.handleClick} />,
            <button data-testid="HeaderMenu-handleClick-same" onClick={() => props?.handleClick('abc')} />,
        </div>
    ),
}));

const getRender = (props?: any) => {
    render(<NavDrawer menuOpen={false} toggleMenu={() => {}} {...props} />);
};

describe('Render', () => {
    it('Should render', () => {
        getRender();
        expect(screen.queryByTestId('ChevronRight')).toBeInTheDocument();
    });

    it('Should render with menuOpen', () => {
        getRender({ menuOpen: true });
        expect(screen.queryByTestId('ChevronLeft')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('Should toggle menu', () => {
        const toggleMenu = jest.fn();
        getRender({ toggleMenu });
        const button = screen.getByTestId('IconButton-onClick');
        fireEvent.click(button);
        expect(toggleMenu).toHaveBeenCalledTimes(1);
    });

    it('Should handle click on MenuNav', () => {
        const mockToggleMenu = jest.fn();
        getRender({
            menuOpen: true,
            toggleMenu: mockToggleMenu,
        });
        fireEvent.click(screen.getByTestId('IconButton-onClick'));
        fireEvent.click(screen.getByTestId('HeaderMenu-handleClick'));
        expect(mockToggleMenu).toHaveBeenCalled();
    });

    it('Should handle click on MenuNav', () => {
        const mockToggleMenu = jest.fn();
        getRender({
            menuOpen: true,
            toggleMenu: mockToggleMenu,
        });
        fireEvent.click(screen.getByTestId('IconButton-onClick'));
        fireEvent.click(screen.getByTestId('HeaderMenu-handleClick-same'));
        fireEvent.click(screen.getByTestId('HeaderMenu-handleClick-same'));
        expect(mockToggleMenu).toHaveBeenCalled();
    });
});
