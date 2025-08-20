import { render, screen } from '@testing-library/react';
import TabLabel from '../TabLabel';

const getRender = (props?: any) => {
    render(<TabLabel content="demo content" {...props} />);
};

describe('Render and Actions', () => {
    it('should render', () => {
        getRender();

        expect(screen.getByText('demo content')).toBeInTheDocument();
    });

    it('should render with error', () => {
        getRender({
            error: true,
        });

        expect(screen.getByText('!')).toBeInTheDocument();
    });

    it('should render with error', () => {
        getRender({
            error: true,
            errContent: 'error content',
        });

        expect(screen.getByText('error content')).toBeInTheDocument();
    });
});
