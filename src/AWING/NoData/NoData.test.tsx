import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Container from '.';

describe('Render', () => {
    it('should render correctly', () => {
        render(<Container />);

        expect(screen.getByText('Common.NoData')).toBeInTheDocument();
    });
});
