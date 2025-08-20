import { render, screen } from '@testing-library/react';
import Container from './Container';

describe('render', () => {
    it('should render the footer container', () => {
        render(<Container appName="AWING" />);
        expect(screen.getByText('Copyright © AWING 2025.')).toBeInTheDocument();
    });
});
