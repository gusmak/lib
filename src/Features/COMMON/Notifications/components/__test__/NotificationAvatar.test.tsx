import { render, screen } from '@testing-library/react';
import NotificationAvatar from '../NotificationAvatar';

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Avatar: (props: any) => (
        <div>
            <p data-testid="Avatar-url">{props?.src}</p>
            <p data-testid="Avatar-name">{props?.title}</p>
        </div>
    ),
}));

const demoUrl = 'https://raw.githubusercontent.com/antonmc/minifig/HEAD/output.svg?sanitize=true';

describe('Render', () => {
    it('should render', () => {
        render(<NotificationAvatar />);
        expect(screen.getByTestId('Avatar-url')).toHaveTextContent('/broken-image.jpg');
    });
    it('should render with name', () => {
        render(<NotificationAvatar name="Demo Name" />);
        expect(screen.getByTestId('Avatar-url')).toHaveTextContent('/broken-image.jpg');
        expect(screen.getByTestId('Avatar-name')).toHaveTextContent('Demo Name');
    });

    it('should render with name and url', () => {
        render(<NotificationAvatar name="Demo Name" url={demoUrl} />);
        expect(screen.getByTestId('Avatar-url')).toHaveTextContent(demoUrl);
        expect(screen.getByTestId('Avatar-name')).toHaveTextContent('Demo Name');
    });
});
