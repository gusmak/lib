import { render, screen } from '@testing-library/react';
import Container from '../Container';

jest.mock('../NotificationDetail', () => ({
    __esModule: true,
    default: () => <div data-testid="NotificationDetail" />,
}));

describe('Render', () => {
    it('should render', () => {
        render(<Container />);
        expect(screen.getByTestId('NotificationDetail')).toBeInTheDocument();
    });
});
