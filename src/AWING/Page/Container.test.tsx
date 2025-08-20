import { render, screen } from '@testing-library/react';
import Container from './Container';
import { HelmetProvider } from 'react-helmet-async';

describe('Page Component', () => {
    it('renders the caption in the title and Typography', () => {
        render(
            <HelmetProvider>
                <Container caption="Test Caption" actions={<div>Actions</div>}>
                    <div>Children</div>
                </Container>
            </HelmetProvider>
        );

        expect(screen.getByText('Test Caption')).toBeInTheDocument();
    });

    it('renders the actions', () => {
        render(
            <HelmetProvider>
                <Container caption="Test Caption" actions={<div>Actions</div>}>
                    <div>Children</div>
                </Container>
            </HelmetProvider>
        );

        expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('renders the children', () => {
        render(
            <HelmetProvider>
                <Container caption="Test Caption" actions={<div>Actions</div>}>
                    <div>Children</div>
                </Container>
            </HelmetProvider>
        );

        expect(screen.getByText('Children')).toBeInTheDocument();
    });
});
