import { render, screen } from '@testing-library/react';
import NotificationContent from '../NotificationContent';
import { getFullDescription } from '../Message';

jest.mock('../Message', () => ({
    getFullDescription: jest.fn(),
}));

describe('Render', () => {
    beforeEach(() => {
        (getFullDescription as jest.Mock).mockReturnValue({
            title: 'Demo title',
            url: 'https://awing.vn/',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        render(
            <NotificationContent
                notificationMessage={{
                    sagaTransactionType: 2,
                    createdDate: {
                        seconds: 122009,
                    },
                }}
            />
        );
        expect(screen.getByText('Demo title')).toBeInTheDocument();
    });
});
