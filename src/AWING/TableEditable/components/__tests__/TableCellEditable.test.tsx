import { fireEvent, render } from '@testing-library/react';
import { FIELD_TYPE } from 'AWING/DataInput';
import TableCellEditable from '../TableCellEditable';

describe('TableCellEditable', () => {
    const mockOnChange = jest.fn();

    it('should render the tooltip', () => {
        const { getByRole } = render(
            <TableCellEditable
                cellDefinition={{
                    fieldName: 'test',
                    type: FIELD_TYPE.TEXT,
                    required: true,
                    isTooltip: true,
                    getTitleTooltip: (value) => `Tooltip for ${value}`,
                    value: 'test',
                    onChange: mockOnChange,
                }}
            />
        );
        const textbox = getByRole('textbox');
        fireEvent.mouseOver(textbox);
    });

    it('should render the radio group', () => {
        const { getByRole } = render(
            <TableCellEditable
                cellDefinition={{
                    fieldName: 'test',
                    type: FIELD_TYPE.RADIO,
                    required: true,
                    options: [
                        {
                            value: 'option1',
                            label: 'Option 1',
                            text: 'option1',
                        },
                        { value: 'option2', label: 'Option 2', text: 'option2' },
                    ],
                    value: 'option1',
                    onChange: mockOnChange,
                }}
            />
        );
        const radioGroup = getByRole('radiogroup');
        expect(radioGroup).toBeInTheDocument();
    });

    it('should render the text-area', () => {
        const { getByRole } = render(
            <TableCellEditable
                cellDefinition={{
                    fieldName: 'test',
                    type: FIELD_TYPE.TEXT_AREA,
                    required: true,
                    value: 'test',
                    onChange: mockOnChange,
                }}
            />
        );
        const textarea = getByRole('textbox');
        expect(textarea).toBeInTheDocument();
    });

    it('cellDefinition?.TableCellProps?.align == right', () => {
        const { getByRole } = render(
            <TableCellEditable
                cellDefinition={{
                    fieldName: 'test',
                    type: FIELD_TYPE.TEXT_AREA,
                    required: true,
                    value: 'test',
                    onChange: mockOnChange,
                    TableCellProps: { align: 'right' },
                }}
            />
        );
        const textarea = getByRole('textbox');
        expect(textarea).toBeInTheDocument();
    });

    it('error == true', () => {
        const { getByRole } = render(
            <TableCellEditable
                cellDefinition={{
                    fieldName: 'test',
                    type: FIELD_TYPE.TEXT_AREA,
                    required: true,
                    value: 'test',
                    onChange: mockOnChange,
                    error: true,
                }}
            />
        );
        const textarea = getByRole('textbox');
        expect(textarea).toBeInTheDocument();
    });

    it('value == null', () => {
        const { getByRole } = render(
            <TableCellEditable
                cellDefinition={{
                    fieldName: 'test',
                    type: FIELD_TYPE.TEXT_AREA,
                    required: true,
                    value: undefined,
                    onChange: mockOnChange,
                    error: true,
                }}
            />
        );
        const textarea = getByRole('textbox');
        expect(textarea).toBeInTheDocument();
    });

    it('onChange data', () => {
        const { getByRole } = render(
            <TableCellEditable
                cellDefinition={{
                    fieldName: 'test',
                    type: FIELD_TYPE.TEXT_AREA,
                    onChange: mockOnChange,
                }}
            />
        );
        const textarea = getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'test2' } });
        expect(textarea).toBeInTheDocument();
    });
});
