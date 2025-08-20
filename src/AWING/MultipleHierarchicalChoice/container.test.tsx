import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { USE_LOGIC_OPERATOR } from 'Commons/Constant';
import MultipleHierarchicalChoice from './container';
import { IMultipleHierarchicalChoiceInput } from './interface';

jest.mock('react', () => {
    const actual = jest.requireActual('react');
    return {
        ...actual,
        useState: actual.useState as jest.Mock,
        // your mocked methods
    };
});

const mockOptions: IMultipleHierarchicalChoiceInput[] = [
    {
        code: 'parent1',
        name: 'Parent 1',
        parentUnitCode: '',
    },
    {
        code: 'child1',
        name: 'Child 1',
        parentUnitCode: 'parent1',
    },
    {
        code: 'parent2',
        name: 'Parent 2',
        parentUnitCode: '',
    },
];

const defaultProps = {
    options: mockOptions,
    onChange: jest.fn(),
    onEndAdornmentValueChange: jest.fn(),
};

describe('MultipleHierarchicalChoice', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with default props', () => {
        render(<MultipleHierarchicalChoice {...defaultProps} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('shows placeholder text', () => {
        const placeholder = 'Select items';
        render(<MultipleHierarchicalChoice {...defaultProps} placeholder={placeholder} />);
        expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
    });

    it('displays error and helper text', () => {
        const helperText = 'This is required';
        render(<MultipleHierarchicalChoice {...defaultProps} error={true} helperText={helperText} />);
        expect(screen.getByText(helperText)).toBeInTheDocument();
    });

    it('handles handleOperatorChange', async () => {
        render(<MultipleHierarchicalChoice {...defaultProps} value={[[mockOptions[0]]]} endAdornmentOptions={USE_LOGIC_OPERATOR} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            fireEvent.click(input);
        });

        const operatorBtn = screen.getByRole('button', { name: /OR/i });
        await act(async () => {
            fireEvent.click(operatorBtn);
        });
    });

    it('handles selection of parent item', async () => {
        render(<MultipleHierarchicalChoice {...defaultProps} maxSelected={2} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            fireEvent.click(input);
        });

        const openBtn = screen.getByRole('button', { name: /Open/i });
        await act(async () => {
            fireEvent.click(openBtn);
        });
    });

    it('handles close function with (minLevel && currentChoice.length >= minLevel) is false', async () => {
        render(<MultipleHierarchicalChoice {...defaultProps} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            fireEvent.click(input);
        });

        const openBtn = screen.getByRole('button', { name: /Open/i });
        await act(async () => {
            fireEvent.click(openBtn);
        });

        const closeBtn = screen.getByRole('button', { name: /Close/i });
        await act(async () => {
            fireEvent.click(closeBtn);
        });
        expect(defaultProps.onChange).not.toHaveBeenCalled();
        expect(screen.queryByText('Parent 2')).not.toBeInTheDocument();
    });

    it('handles change with optionByCode < 0', async () => {
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [[mockOptions[0]], jest.fn()])
            .mockImplementationOnce(() => [[mockOptions], jest.fn()])
            .mockImplementationOnce(() => [[mockOptions[0]], jest.fn()])
            .mockImplementationOnce(() => [true, jest.fn()])
            .mockImplementationOnce(() => ['472642788', jest.fn()]);

        render(<MultipleHierarchicalChoice {...defaultProps} options={[]} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            fireEvent.click(input);
        });
        act(() => {
            fireEvent.click(screen.getByText('Parent 1'));
        });
        const closeBtn = screen.getByRole('button', { name: /Close/i });
        await act(async () => {
            fireEvent.click(closeBtn);
        });
    });
    it('handles close function with (minLevel && currentChoice.length >= minLevel) is true', async () => {
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [[mockOptions[0]], jest.fn()])
            .mockImplementationOnce(() => [[mockOptions], jest.fn()])
            .mockImplementationOnce(() => [[mockOptions[0]], jest.fn()])
            .mockImplementationOnce(() => [true, jest.fn()])
            .mockImplementationOnce(() => ['472642788', jest.fn()]);

        render(<MultipleHierarchicalChoice {...defaultProps} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            fireEvent.click(input);
        });
        act(() => {
            fireEvent.click(screen.getByText('Parent 1'));
        });
        const closeBtn = screen.getByRole('button', { name: /Close/i });
        await act(async () => {
            fireEvent.click(closeBtn);
        });
    });

    it('handles close function with (minLevel && currentChoice.length >= minLevel) is true and checkExist is true', async () => {
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [[mockOptions[0]], jest.fn()])
            .mockImplementationOnce(() => [[mockOptions], jest.fn()])
            .mockImplementationOnce(() => [[mockOptions[2]], jest.fn()])
            .mockImplementationOnce(() => [true, jest.fn()])
            .mockImplementationOnce(() => ['472642788', jest.fn()]);

        render(<MultipleHierarchicalChoice {...defaultProps} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            fireEvent.click(input);
        });
        act(() => {
            fireEvent.click(screen.getByText('Parent 1'));
        });
        const closeBtn = screen.getByRole('button', { name: /Close/i });
        await act(async () => {
            fireEvent.click(closeBtn);
        });
    });
    it('handles close function with (minLevel && currentChoice.length >= minLevel) is true and checkExist is false', async () => {
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [[mockOptions[0]], jest.fn()])
            .mockImplementationOnce(() => [[mockOptions], jest.fn()])
            .mockImplementationOnce(() => [[mockOptions[0]], jest.fn()])
            .mockImplementationOnce(() => [true, jest.fn()])
            .mockImplementationOnce(() => ['472642788', jest.fn()]);

        render(<MultipleHierarchicalChoice {...defaultProps} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            fireEvent.click(input);
        });
        act(() => {
            fireEvent.click(screen.getByText('Parent 1'));
        });
        const closeBtn = screen.getByRole('button', { name: /Close/i });
        await act(async () => {
            fireEvent.click(closeBtn);
        });
    });
    it('handles close function with (minLevel && currentChoice.length >= minLevel) is true and checkExist is false', async () => {
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [[mockOptions[0]], jest.fn()])
            .mockImplementationOnce(() => [[[mockOptions[1]]], jest.fn()])
            .mockImplementationOnce(() => [[mockOptions[0]], jest.fn()])
            .mockImplementationOnce(() => [true, jest.fn()])
            .mockImplementationOnce(() => ['472642788', jest.fn()]);

        render(<MultipleHierarchicalChoice {...defaultProps} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            fireEvent.click(input);
        });
        act(() => {
            fireEvent.click(screen.getByText('Parent 1'));
        });
        const closeBtn = screen.getByRole('button', { name: /Close/i });
        await act(async () => {
            fireEvent.click(closeBtn);
        });
    });

    it('handles selection with reason is removeOption', async () => {
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [[mockOptions[0]], jest.fn()])
            .mockImplementationOnce(() => [[mockOptions], jest.fn()])
            .mockImplementationOnce(() => [[mockOptions[0]], jest.fn()])
            .mockImplementationOnce(() => [true, jest.fn()])
            .mockImplementationOnce(() => ['472642788', jest.fn()]);

        render(<MultipleHierarchicalChoice {...defaultProps} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            fireEvent.click(input);
        });
        act(() => {
            fireEvent.click(screen.getByText('Parent 1'));
        });
        const closeBtn = screen.getByRole('button', { name: /Close/i });
        await act(async () => {
            fireEvent.click(closeBtn);
        });
        const removeOptionBtn = screen.getByTestId('CancelIcon');
        await act(async () => {
            fireEvent.click(removeOptionBtn);
        });
    });

    it('handles selection with reason is clear', async () => {
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [[mockOptions[0]], jest.fn()])
            .mockImplementationOnce(() => [[mockOptions], jest.fn()])
            .mockImplementationOnce(() => [[mockOptions[0]], jest.fn()])
            .mockImplementationOnce(() => [true, jest.fn()])
            .mockImplementationOnce(() => ['472642788', jest.fn()]);

        render(<MultipleHierarchicalChoice {...defaultProps} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            fireEvent.click(input);
        });
        act(() => {
            fireEvent.click(screen.getByText('Parent 1'));
        });
        const closeBtn = screen.getByRole('button', { name: /Close/i });
        await act(async () => {
            fireEvent.click(closeBtn);
        });
        const clearBtn = screen.getByTestId('CloseIcon');
        await act(async () => {
            fireEvent.click(clearBtn);
        });
    });
});
