import { render, screen } from '@testing-library/react';
import TabPermissionStates, { TabPermissionStatesProps } from '../TabPermissionStates';

// #region Render Component
const Component = (props?: TabPermissionStatesProps) => {
    return <TabPermissionStates {...props} />;
};
const getRender = (props?: TabPermissionStatesProps) => render(Component(props));
// #region

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Box: (props: any) => (
        <div>
            Component
            {props?.children}
        </div>
    ),
    Tabs: (props: any) => (
        <div>
            <button data-testid="Tabs-onChange" onClick={() => props.onChange({}, '1')}>
                Tab 1
            </button>
            {props?.children}
        </div>
    ),
}));

describe('Render', () => {
    it('should render null', () => {
        getRender();

        expect(screen.queryByText('Component')).toBeNull();
    });

    it('should render', () => {
        getRender({
            isShow: true,
        });

        expect(screen.queryByText('Component')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should call onChangeTab', () => {
        const mockOnChangeTab = jest.fn();
        getRender({
            isShow: true,
            // objectStates: [{ id: '1', name: 'State 1' }],
            onChangeTab: mockOnChangeTab,
        });

        screen.getByTestId('Tabs-onChange').click();

        expect(mockOnChangeTab).toHaveBeenCalledWith('1');
    });
});
