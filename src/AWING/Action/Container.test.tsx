import { fireEvent, render, screen } from '@testing-library/react';
import Container from './Container';

// Mock MUI
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Tooltip: (props?: any) => (
        <div data-testid="Tooltip">
            <p data-testid="Tooltip-title">{props?.title}</p>
            {props?.children}
        </div>
    ),
    IconButton: (props?: any) => (
        <div data-testid="IconButton">
            <button data-testid="IconButton-onClick" onClick={props?.onClick} />
            {props?.children}
        </div>
    ),
    Menu: (props?: any) => (
        <div data-testid="Menu">
            {props?.open ? <p data-testid="Menu-open" /> : <p data-testid="Menu-not-open" />}
            <button data-testid="Menu-onClose" onClick={props?.onClose} />
            {props?.children}
        </div>
    ),
    MenuItem: (props?: any) => (
        <div data-testid="MenuItem">
            <button data-testid="MenuItem-onClick" onClick={props?.onClick} />
            {props?.children}
        </div>
    ),
}));

const getRender = (props?: any) => {
    render(<Container menus={[]} {...props} />);
};

describe('Render and Actions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('render basic', () => {
        getRender();
        expect(screen.getByText('Common.More')).toBeInTheDocument();
    });

    it('render menu', () => {
        getRender();

        fireEvent.click(screen.getByTestId('IconButton-onClick'));
        expect(screen.getByTestId('Menu-open')).toBeInTheDocument();
    });

    it('render list menu item', () => {
        getRender({
            menus: [
                {
                    icon: 'icon demo 1',
                    name: 'name demo ',
                    action: jest.fn(),
                },
                {
                    icon: 'icon demo 1',
                    name: 'name demo 1',
                    action: jest.fn(),
                },
            ],
        });

        expect(screen.getAllByTestId('MenuItem')).toHaveLength(2);
    });

    it('should call Menu onClose', () => {
        getRender({
            menus: [
                {
                    icon: 'icon demo 1',
                    name: 'name demo ',
                    action: jest.fn(),
                },
                {
                    icon: 'icon demo 1',
                    name: 'name demo 1',
                    action: jest.fn(),
                },
            ],
        });

        expect(screen.getAllByTestId('MenuItem')).toHaveLength(2);
        fireEvent.click(screen.getByTestId('Menu-onClose'));
        expect(screen.getByTestId('Menu-not-open')).toBeInTheDocument();
    });
});
