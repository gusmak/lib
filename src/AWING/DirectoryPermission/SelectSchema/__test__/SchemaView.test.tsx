import { fireEvent, render, screen } from '@testing-library/react';
import { convertToDisplayData, convertToTreeData, getRootSchema } from 'Features/SYSTEM/Schema/utils';
import SchemaView from '../SchemaView';
import type { SchemaViewProps } from '../types';

const initProps: SchemaViewProps = {
    objectDefinitions: [],
    rootSchemas: [],
    selectedSchemaIds: [],
    onOpenEditSchema: jest.fn(),
    onSelectedSchemaChange: jest.fn(),
    schema: {},
};

const getRender = (props?: Partial<SchemaViewProps>) => {
    render(<SchemaView {...initProps} {...props} />);
};

// #region Mock

jest.mock('@mui/x-tree-view', () => ({
    SimpleTreeView: (props: any) => {
        return (
            <div>
                <p data-testid="SimpleTreeView-header">SimpleTreeView</p>
                <p data-testid="SimpleTreeView-expandedItems">{props?.expandedItems.map((i: any) => i)}</p>
                <button
                    data-testid="SimpleTreeView-onExpandedItemsChange"
                    onClick={(e: any) => props.onExpandedItemsChange({}, e.target.nodeIds)}
                />

                {props?.children}
            </div>
        );
    },
    TreeItem: (props: any) => {
        return (
            <div>
                <p data-testid="TreeItem-header">TreeItem</p>

                {props?.children}
            </div>
        );
    },
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Checkbox: (props: any) => {
        return (
            <div>
                <button data-testid="Checkbox-onChange" onClick={(e: any) => props.onChange({}, e.target.cbChecked)} />
            </div>
        );
    },
    Typography: (props: any) => {
        return (
            <div>
                <button data-testid="Typography-onClick" onClick={props.onClick} />
                {props?.children}
            </div>
        );
    },
}));

jest.mock('Features/SYSTEM/Schema/utils', () => ({
    convertToDisplayData: jest.fn(),
    convertToTreeData: jest.fn(),
    getRootSchema: jest.fn(),
}));

jest.mock('Features/SYSTEM/Schema', () => ({
    FieldView: (props: any) => {
        return (
            <div>
                <p data-testid="FieldView-header">FieldView</p>
                <textarea defaultValue={JSON.stringify(props?.fieldInfo)}></textarea>
                <textarea defaultValue={JSON.stringify(props?.schemaDetails)}></textarea>
            </div>
        );
    },
}));
// #endregion

beforeEach(() => {
    (convertToDisplayData as jest.Mock).mockReturnValue([]);
    (convertToTreeData as jest.Mock).mockReturnValue([]);
    (getRootSchema as jest.Mock).mockReturnValue({});
});
afterEach(() => {
    jest.clearAllMocks();
});

describe('Render', () => {
    it('should render null', () => {
        getRender({
            schema: undefined,
        });
        expect(screen.queryByText('SimpleTreeView')).toBeNull();
    });

    it('should render SimpleTreeView', () => {
        getRender();
        expect(screen.getByText('SimpleTreeView')).toBeInTheDocument();
    });

    it('should render FieldView', () => {
        (convertToTreeData as jest.Mock).mockReturnValue([
            {
                id: 10,
                objectTypeCode: 'Campaigns',
                fieldName: 'id',
                fieldPath: '.id.',
            },
        ]);
        getRender({
            schema: {
                schemaObjectDefinitions: [
                    {
                        id: 10,
                    },
                ],
            },
        });
        expect(screen.getByText('FieldView')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should call SimpleTreeView onExpandedItemsChange', () => {
        getRender();

        fireEvent.click(screen.getByTestId('SimpleTreeView-onExpandedItemsChange'), {
            target: {
                nodeIds: ['1'],
            },
        });
        fireEvent.click(screen.getByTestId('Checkbox-onChange'), {
            target: {
                cbChecked: true,
            },
        });
    });

    it('should call Typography onClick', () => {
        const mockOnOpenEditSchema = jest.fn();
        getRender({
            onOpenEditSchema: mockOnOpenEditSchema,
        });

        fireEvent.click(screen.getAllByTestId('Typography-onClick')[0]);
        expect(mockOnOpenEditSchema).toHaveBeenCalled();
    });
});
