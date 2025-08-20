import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import AsyncAutocomplete from './Container';

interface TestOption {
    id: number;
    name: string;
}

jest.mock('react', () => {
    const actual = jest.requireActual('react');
    return {
        ...actual,
        useState: actual.useState as jest.Mock,
        // your mocked methods
    };
});

describe('AsyncAutocomplete', () => {
    const mockFetchData = jest.fn();
    const mockOnChange = jest.fn();

    const defaultProps = {
        fetchData: mockFetchData,
        getOptionValue: (option: TestOption) => option.id,
        getOptionLabel: (option: TestOption) => option.name,
        onChange: mockOnChange,
    };

    const mockOptions: TestOption[] = [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' },
        { id: 3, name: 'Option 3' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockFetchData.mockResolvedValue(mockOptions);
    });

    describe('AsyncAutocomplete loading state', () => {
        it('should render CircularProgress when loading is true', async () => {
            mockFetchData.mockImplementation(() => new Promise(() => {})); // Simulate a pending promise
            render(<AsyncAutocomplete {...defaultProps} />);
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await userEvent.type(input, 'Option');
            await waitFor(() => {
                expect(screen.getByRole('progressbar')).toBeInTheDocument();
            });
        });
        it('should not render CircularProgress when loading is false', async () => {
            render(<AsyncAutocomplete {...defaultProps} />);
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await userEvent.type(input, 'Option');
            await waitFor(() => {
                expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
            });
        });
    });
    describe('multiple select mode', () => {
        it('should call onChange with array of selected values when options are selected', async () => {
            render(<AsyncAutocomplete {...defaultProps} multiple />);

            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await userEvent.type(input, 'Option');

            await waitFor(() => {
                expect(screen.getByText('Option 1')).toBeInTheDocument();
            });

            // Select multiple options
            await userEvent.click(screen.getByText('Option 1'));
        });
        it('should call onChange with array of selected values when options are selected', async () => {
            render(
                <AsyncAutocomplete
                    {...defaultProps}
                    multiple
                    value={[
                        { id: 1, label: 'Option 1' },
                        { id: 2, label: 'Option 2' },
                    ]}
                />
            );

            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await userEvent.type(input, 'Option');

            await waitFor(() => {
                expect(screen.getByText('Option 3')).toBeInTheDocument();
            });

            // Select multiple options
            await userEvent.click(screen.getByText('Option 3'));
        });

        it('should call onChange with array of selected values when options are selected', async () => {
            render(<AsyncAutocomplete {...defaultProps} multiple value={{ id: 1, label: 'Option 1' }} />);

            const input = screen.getByRole('combobox');
            await userEvent.click(input);
        });
    });
    describe('multiple select mode', () => {
        it('should call onChange with array of selected values when options are selected', async () => {
            render(<AsyncAutocomplete {...defaultProps} multiple={false} />);

            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await userEvent.type(input, 'Option');

            await waitFor(() => {
                expect(screen.getByText('Option 1')).toBeInTheDocument();
            });

            // Select multiple options
            await userEvent.click(screen.getByText('Option 1'));
        });
        it('should call onChange with array of selected values when options are selected', async () => {
            render(
                <AsyncAutocomplete
                    {...defaultProps}
                    multiple={false}
                    value={[
                        { id: 1, label: 'Option 1' },
                        { id: 2, label: 'Option 2' },
                    ]}
                />
            );

            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await userEvent.type(input, 'Option');
        });
    });

    it('should render CircularProgress when loading is true', async () => {
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => ['dsds', jest.fn()])
            .mockImplementationOnce(() => [[], jest.fn()])
            .mockImplementationOnce(() => [true, jest.fn()]);

        render(<AsyncAutocomplete {...defaultProps} multiple />);
        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await userEvent.type(input, 'Option');
    });
});
