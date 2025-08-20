import { render, screen } from '@testing-library/react';
import NotificationLoading from '../NotificationLoading';

describe('Render', () => {
    it('should render', () => {
        render(<NotificationLoading />);
        expect(screen.getAllByRole('timer')).toHaveLength(3);
    });
});
