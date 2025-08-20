import { fireEvent, render, screen } from '@testing-library/react';
import WorkspaceSharingInfomation, { WorkspaceSharingInfomationProps } from '../WorkspaceSharingInformation';
import { useAtomValue } from 'jotai';
import { WorkspaceSchemaOptionsState } from '../../Atoms';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('jotai', () => ({
    ...jest.requireActual('jotai'),
    useAtomValue: jest.fn(),
}));

jest.mock('AWING', () => ({
    DataForm: (props: any) => (
        <div data-testid="data-form">
            {props.fields.map((field: any) => (
                <div key={field.fieldName}>
                    <label>{field.label}</label>
                    {field.disabled ? <span data-testid="disabled"></span> : <span data-testid="enabled"></span>}
                </div>
            ))}
            <button data-testid="onUpdate" onClick={() => props.onUpdate()}>
                onUpdate
            </button>
        </div>
    ),
}));

describe('WorkspaceSharingInfomation', () => {
    const formData: any = {
        objectTypeCode: 'type1',
        name: 'Test Name',
        objectFilterId: 1,
        schemaId: 1,
    };

    const objectFilters = [
        { id: 1, name: 'Filter 1', objectType: 'type1' },
        { id: 2, name: 'Filter 2', objectType: 'type2' },
    ];

    const schemaOptions = [
        { id: 1, name: 'Schema 1', objectTypeCode: 'type1' },
        { id: 2, name: 'Schema 2', objectTypeCode: 'type2' },
    ];

    const renderComponent = (props: Partial<WorkspaceSharingInfomationProps> = {}) => {
        const defaultProps: WorkspaceSharingInfomationProps = {
            formData: formData,
            onUpdateFormInfomation: jest.fn(),
            isCreate: true,
            objectFilters: objectFilters,
            isSchemaRequired: true,
            ...props,
        };

        render(<WorkspaceSharingInfomation {...defaultProps} />);
    };

    beforeEach(() => {
        (useAtomValue as jest.Mock).mockImplementation((state) => {
            if (state === WorkspaceSchemaOptionsState) {
                return schemaOptions;
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the WorkspaceSharingInfomation component', () => {
        renderComponent();

        expect(screen.getByText('WorkspaceSharing.Label.ObjectType')).toBeInTheDocument();
        expect(screen.getByText('WorkspaceSharing.Label.Name')).toBeInTheDocument();
        expect(screen.getByText('WorkspaceSharing.Label.Filter')).toBeInTheDocument();
        expect(screen.getByText('WorkspaceSharing.Label.Schema')).toBeInTheDocument();
    });

    it('should render the WorkspaceSharingInfomation component with isCreate = false and objectTypeCode is undefined', () => {
        renderComponent({ isCreate: false, formData: { ...formData, objectTypeCode: undefined } });

        expect(screen.getByText('WorkspaceSharing.Label.ObjectType')).toBeInTheDocument();
        expect(screen.getByText('WorkspaceSharing.Label.Name')).toBeInTheDocument();
        expect(screen.getByText('WorkspaceSharing.Label.Filter')).toBeInTheDocument();
        expect(screen.getByText('WorkspaceSharing.Label.Schema')).toBeInTheDocument();
        expect(screen.getAllByTestId('disabled')).toHaveLength(3);
    });

    it('handles update', () => {
        const onUpdateFormInfomation = jest.fn();
        renderComponent({ onUpdateFormInfomation });

        const updateButton = screen.getByTestId('onUpdate');
        expect(updateButton).toBeInTheDocument();
        fireEvent.click(updateButton);
        expect(onUpdateFormInfomation).toHaveBeenCalled();
    });
});
