import { fireEvent, render, screen } from '@testing-library/react';
import MenuNav from '../MenuNav';

jest.mock('react-router', () => ({
    Link: (props: any) => <a data-testid="Router-Link">{props?.children}</a>,
    matchPath: () => true,
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    ListItemButton: (props: any) => (
        <div data-testid="ListItemText">
            {props?.children}
            <button data-testid="ListItemButton-onClick" onClick={props?.onClick} />,
        </div>
    ),
    Tooltip: (props: any) => (
        <div data-testid="Tooltip" title={props?.title}>
            {props?.children}
        </div>
    ),
}));

jest.mock('../HeaderMenu', () => ({
    __esModule: true,
    default: (props: any) => (
        <div data-testid="HeaderMenu">
            {props?.children}
            <p data-testid={`HeaderMenu-theme`}>{props?.sx({ spacing: () => '8px' }).paddingLeft}</p>
            <button data-testid="HeaderMenu-onClick" onClick={props?.onClick} />,
        </div>
    ),
}));

const getRender = (props?: any) => {
    render(
        <MenuNav
            routes={[
                {
                    key: 'test',
                    title: 'Test',
                    subRoutes: [
                        {
                            key: 'test child 1',
                            title: 'Test Child 1',
                        },
                    ],
                },
                {
                    key: 'test 2',
                    title: 'Test 2',
                    path: '/test 2',
                },
                {
                    key: 'test 3',
                    title: 'Test 3',
                    icon: 'testIcon',
                },
            ]}
            zoomOut={false}
            open="test"
            handleClick={() => {}}
            {...props}
        />
    );
};

describe('Render', () => {
    it('Should render', () => {
        getRender();
        expect(screen.queryByTestId('HeaderMenu')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('Should call HeaderMenu click', () => {
        const mockHeaderMenuClick = jest.fn();

        getRender({
            handleClick: mockHeaderMenuClick,
        });
        fireEvent.click(screen.getByTestId('HeaderMenu-onClick'));
        expect(mockHeaderMenuClick).toHaveBeenCalled();
    });

    it('Should call HeaderMenu click with zoomOut is true', () => {
        const mockHeaderMenuClick = jest.fn();
        getRender({ zoomOut: true, handleClick: mockHeaderMenuClick });
        fireEvent.click(screen.getByTestId('HeaderMenu-onClick'));
        expect(mockHeaderMenuClick).toHaveBeenCalled();
    });

    it('Should call HeaderMenu click with zoomOut is true', () => {
        const mockHeaderMenuClick = jest.fn();
        getRender({ zoomOut: true, handleClick: mockHeaderMenuClick });
        fireEvent.click(screen.getAllByTestId('ListItemButton-onClick')[1]);
        expect(mockHeaderMenuClick).toHaveBeenCalled();
    });
});
