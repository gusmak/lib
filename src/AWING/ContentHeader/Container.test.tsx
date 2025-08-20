/* eslint-disable */
import { render, screen } from '@testing-library/react';
import Container from './Container';

const getRender = (props?: any) => {
    render(<Container title="Demo Title" {...props} />);
};

describe('Render', () => {
    it('should render', () => {
        getRender({
            columnLeftWidth: 6,
            columnRightWidth: 6,
        });

        expect(screen.getByText('Demo Title')).toBeInTheDocument();
    });

    it('should render headerRight', () => {
        getRender({
            headerRight: <div>Header Right</div>,
        });

        expect(screen.getByText('Header Right')).toBeInTheDocument();
    });
});
