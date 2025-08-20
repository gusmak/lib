import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { DEFAULT_RADIUS, MIN_RADIUS } from 'Commons/Constant';
import Container from './container';

// Mock lodash debounce
jest.mock('lodash', () => ({
    debounce: (fn: any) => {
        fn.cancel = jest.fn();
        return fn;
    },
}));

// Mock the Component
jest.mock('./component', () => {
    return function MockedComponent(props: any) {
        return (
            <div data-testid="mocked-component">
                <input
                    data-testid="location-input"
                    value={props.locationString}
                    onChange={(e) => props.onChange('locationString', e.target.value)}
                />
                <input data-testid="radius-input" value={props.radius} onChange={(e) => props.onChange('radius', e.target.value)} />
                <button data-testid="search-button" onClick={props.onSearch}>
                    Search
                </button>
                <button data-testid="map-select-button" onClick={() => props.onGoongMapSelect({ latitude: 10, longitude: 20 })}>
                    Select on Map
                </button>
            </div>
        );
    };
});

describe('Container Component', () => {
    const mockOnChangeValue = jest.fn();
    const defaultProps = {
        configs: { GOOGLE_MAP_KEY: 'test-key' },
        onChangeValue: mockOnChangeValue,
        label: 'Test Label',
        initValue: undefined,
        value: undefined,
        limit: { min: MIN_RADIUS },
        isOnlyMap: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with default values when no initial value provided', () => {
        const { getByTestId } = render(<Container {...defaultProps} />);

        expect(getByTestId('location-input')).toHaveValue('');
        expect(getByTestId('radius-input')).toHaveValue(DEFAULT_RADIUS);
    });

    it('renders with initial values when value is undefined', () => {
        const initValue = {
            latitude: 1,
            longitude: 2,
            radius: 300,
        };
        const { getByTestId } = render(
            <Container {...defaultProps} limit={undefined} value={{ latitude: 1, longitude: 2, radius: undefined }} initValue={initValue} />
        );

        expect(getByTestId('location-input')).toHaveValue('1, 2');
        expect(getByTestId('radius-input')).toHaveValue('500');
    });
    it('renders with initial values when limit is undefined', () => {
        const initValue = {
            latitude: 1,
            longitude: 2,
            radius: 500,
        };
        const { getByTestId } = render(<Container {...defaultProps} limit={undefined} initValue={initValue} />);

        expect(getByTestId('location-input')).toHaveValue('1, 2');
        expect(getByTestId('radius-input')).toHaveValue('500');
    });
    it('renders with initial values when provided', () => {
        const initValue = {
            latitude: 1,
            longitude: 2,
            radius: 500,
        };
        const { getByTestId } = render(<Container {...defaultProps} initValue={initValue} />);

        expect(getByTestId('location-input')).toHaveValue('1, 2');
        expect(getByTestId('radius-input')).toHaveValue('500');
    });

    it('updates location string when user types', async () => {
        const { getByTestId } = render(<Container {...defaultProps} />);
        const input = getByTestId('location-input');

        fireEvent.change(input, { target: { value: '10, 20' } });

        expect(input).toHaveValue('10, 20');
        await waitFor(() => {
            expect(mockOnChangeValue).toHaveBeenCalledWith({
                latitude: 10,
                longitude: 20,
                radius: Number(DEFAULT_RADIUS),
            });
        });
    });

    it('updates radius when user types', async () => {
        const { getByTestId } = render(<Container {...defaultProps} />);
        const radiusInput = getByTestId('radius-input');

        fireEvent.change(radiusInput, { target: { value: '1000' } });

        expect(radiusInput).toHaveValue('1000');
    });

    it('handles map selection', async () => {
        const { getByTestId } = render(<Container {...defaultProps} />);

        fireEvent.click(getByTestId('map-select-button'));

        expect(getByTestId('location-input')).toHaveValue('10, 20');
        await waitFor(() => {
            expect(mockOnChangeValue).toHaveBeenCalledWith({
                latitude: 10,
                longitude: 20,
                radius: Number(DEFAULT_RADIUS),
            });
        });
    });

    it('handles search button click', async () => {
        const { getByTestId } = render(<Container {...defaultProps} />);

        fireEvent.change(getByTestId('location-input'), {
            target: { value: '10, 20' },
        });
        fireEvent.click(getByTestId('search-button'));

        await waitFor(() => {
            expect(mockOnChangeValue).toHaveBeenCalledWith({
                latitude: 10,
                longitude: 20,
                radius: Number(DEFAULT_RADIUS),
            });
        });
    });

    it('updates when value prop changes', async () => {
        const { rerender, getByTestId } = render(<Container {...defaultProps} />);

        rerender(<Container {...defaultProps} value={{ latitude: 30, longitude: 40, radius: 800 }} />);

        expect(getByTestId('location-input')).toHaveValue('30, 40');
        expect(getByTestId('radius-input')).toHaveValue('800');
    });

    it.skip('validates minimum radius', async () => {
        const { getByTestId } = render(<Container {...defaultProps} />);

        fireEvent.change(getByTestId('radius-input'), {
            target: { value: (MIN_RADIUS - 1).toString() },
        });
        fireEvent.click(getByTestId('search-button'));

        await waitFor(() => {
            expect(mockOnChangeValue).not.toHaveBeenCalled();
        });
    });

    // it('clears values when value prop becomes null', async () => {
    //     const { rerender, getByTestId } = render(
    //         <Container
    //             {...defaultProps}
    //             value={{ latitude: 30, longitude: 40, radius: 800 }}
    //         />
    //     )

    //     rerender(<Container {...defaultProps} value={null} />)

    //     expect(getByTestId('location-input')).toHaveValue('')
    //     expect(getByTestId('radius-input')).toHaveValue(DEFAULT_RADIUS)
    // })

    it('calls onChangeValue with undefined when location or radius is empty', async () => {
        const { getByTestId } = render(<Container {...defaultProps} />);

        fireEvent.change(getByTestId('location-input'), {
            target: { value: '' },
        });
        fireEvent.click(getByTestId('search-button'));

        await waitFor(() => {
            expect(mockOnChangeValue).toHaveBeenCalledWith(undefined);
        });
    });
});
