import { fireEvent, render, screen } from '@testing-library/react';
import ButtonTabs from '../ButtonTabs';

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Button: (props: any) => (
        <div>
            {props.children}
            <button onClick={props?.onClick} data-testid="Button-onClick" />
        </div>
    ),
}));

describe('Render', () => {
    it('should render', () => {
        render(<ButtonTabs tabActive="All" />);
        expect(screen.getByText('Notification.All')).toBeInTheDocument();
    });

    it('should render tabActive tab', () => {
        render(<ButtonTabs tabActive="Unread" />);
        expect(screen.getByText('Notification.Unread')).toBeInTheDocument();
    });

    it('should render with isSearch is true', () => {
        const mockonUpdateTabActive = jest.fn();
        render(<ButtonTabs onUpdateTabActive={mockonUpdateTabActive} />);
        fireEvent.click(screen.getAllByTestId('Button-onClick')[0]);
        expect(mockonUpdateTabActive).toHaveBeenCalled();
    });
});
