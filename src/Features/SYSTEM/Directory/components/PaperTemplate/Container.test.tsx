import { render, screen } from '@testing-library/react';
import Container from './Container';

describe('Container', () => {
    it('renders without crashing', () => {
        render(<Container />);
        expect(screen.getByTestId('paper-template-root')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
        render(
            <Container>
                <div data-testid="child-element">Child Element</div>
            </Container>
        );
        expect(screen.getByTestId('child-element')).toBeInTheDocument();
        expect(screen.getByText('Child Element')).toBeInTheDocument();
    });
});
