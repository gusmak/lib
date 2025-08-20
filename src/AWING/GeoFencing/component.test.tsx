import { render, fireEvent, screen } from '@testing-library/react';
import Component from './component';
import { MIN_RADIUS, MAXIMUM_RADIUS } from 'Commons/Constant';
import '@testing-library/jest-dom';

// Mock the dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key, // Returns the key as translation
    }),
}));

jest.mock('../GoogleMap', () => {
    return function MockGoogleMap({ onUpdateLocation }: any) {
        return (
            <div data-testid="google-map">
                <button onClick={() => onUpdateLocation({ latitude: 10, longitude: 20 })} data-testid="map-update-button">
                    Update Location
                </button>
            </div>
        );
    };
});

describe('Component', () => {
    const defaultProps = {
        label: 'Test Label',
        configs: {
            GOOGLE_MAP_KEY: 'test-api-key',
        },
        marker: {
            latitude: 0,
            longitude: 0,
        },
        radius: '1000',
        locationString: '',
        onChange: jest.fn(),
        onSearch: jest.fn(),
        onGoongMapSelect: jest.fn(),
        limit: {
            min: MIN_RADIUS,
            max: MAXIMUM_RADIUS,
        },
        isOnlyMap: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with default props', () => {
        render(<Component {...defaultProps} />);

        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByLabelText('PlaceFilter.Location')).toBeInTheDocument();
        expect(screen.getByLabelText('PlaceFilter.Radius')).toBeInTheDocument();
    });

    it('handles location input change', () => {
        render(<Component {...defaultProps} />);
        const locationInput = screen.getByLabelText('PlaceFilter.Location');

        fireEvent.change(locationInput, { target: { value: '10.123, 20.456' } });

        expect(defaultProps.onChange).toHaveBeenCalledWith('locationString', '10.123, 20.456');
    });

    it('handles radius input change', () => {
        render(<Component {...defaultProps} />);
        const radiusInput = screen.getByLabelText('PlaceFilter.Radius');

        fireEvent.change(radiusInput, { target: { value: '2000' } });

        expect(defaultProps.onChange).toHaveBeenCalledWith('radius', '2000');
    });

    it('prevents negative radius values', () => {
        render(<Component {...defaultProps} />);
        const radiusInput = screen.getByLabelText('PlaceFilter.Radius');

        fireEvent.change(radiusInput, { target: { value: '-1000' } });

        expect(defaultProps.onChange).not.toHaveBeenCalled();
    });

    it('prevents radius values exceeding maximum limit', () => {
        render(<Component {...defaultProps} />);
        const radiusInput = screen.getByLabelText('PlaceFilter.Radius');

        fireEvent.change(radiusInput, {
            target: { value: String(MAXIMUM_RADIUS + 1) },
        });

        expect(defaultProps.onChange).not.toHaveBeenCalled();
    });

    it('triggers search on Enter key press in location input', () => {
        render(<Component {...defaultProps} />);
        const locationInput = screen.getByLabelText('PlaceFilter.Location');

        fireEvent.keyDown(locationInput, { key: 'Enter' });

        expect(defaultProps.onSearch).toHaveBeenCalled();
    });

    it('triggers search on Enter key press in radius input', () => {
        render(<Component {...defaultProps} />);
        const radiusInput = screen.getByLabelText('PlaceFilter.Radius');

        fireEvent.keyDown(radiusInput, { key: 'Enter' });

        expect(defaultProps.onSearch).toHaveBeenCalled();
    });

    it.skip('toggles map visibility when show map button is clicked', () => {
        render(<Component {...defaultProps} />);
        const showMapButton = screen.getByTestId('ShowMapIcon').parentElement;

        expect(screen.queryByTestId('google-map')).not.toBeInTheDocument();

        fireEvent.click(showMapButton!);

        expect(screen.getByTestId('google-map')).toBeInTheDocument();

        fireEvent.click(showMapButton!);

        expect(screen.queryByTestId('google-map')).not.toBeInTheDocument();
    });

    it('shows map by default when isOnlyMap is true', () => {
        render(<Component {...defaultProps} isOnlyMap={true} />);

        expect(screen.getByTestId('google-map')).toBeInTheDocument();
        expect(screen.queryByLabelText('PlaceFilter.Location')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('PlaceFilter.Radius')).not.toBeInTheDocument();
    });

    it('displays error for invalid location format', () => {
        render(<Component {...defaultProps} locationString="invalid format" />);
        const locationInput = screen.getByLabelText('PlaceFilter.Location');

        expect(locationInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('displays error for radius below minimum limit', () => {
        render(<Component {...defaultProps} radius={String(MIN_RADIUS - 1)} />);
        const radiusInput = screen.getByLabelText('PlaceFilter.Radius');

        expect(radiusInput).toHaveAttribute('aria-invalid', 'true');
    });

    it.skip('handles map location update', () => {
        render(<Component {...defaultProps} />);
        const showMapButton = screen.getByTestId('ShowMapIcon').parentElement;

        fireEvent.click(showMapButton!);
        fireEvent.click(screen.getByTestId('map-update-button'));

        expect(defaultProps.onGoongMapSelect).toHaveBeenCalledWith({
            latitude: 10,
            longitude: 20,
        });
    });

    it('renders with custom limits', () => {
        const customLimits = {
            min: 500,
            max: 5000,
        };
        render(<Component {...defaultProps} limit={customLimits} />);
        const radiusInput = screen.getByLabelText('PlaceFilter.Radius');

        fireEvent.change(radiusInput, { target: { value: '5500' } });
        expect(defaultProps.onChange).not.toHaveBeenCalled();

        fireEvent.change(radiusInput, { target: { value: '4000' } });
        expect(defaultProps.onChange).toHaveBeenCalledWith('radius', '4000');
    });
});
