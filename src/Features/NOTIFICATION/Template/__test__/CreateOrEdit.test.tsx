import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateOrEdit from '../CreateOrEdit';
import * as hooks from '../hooks/useCreateOrEdit';
import { FormMode } from '../../enums';
import { TemplateContext } from '../context';
import { MemoryRouter } from 'react-router';
import { TemplateServices } from '../Services';
// import { useCreateTemplateMutation, useGetTemplateByIdLazyQuery, useGetObjectDefinitionsQuery, useUpdateTemplateMutation, useGenerateTemplateLazyQuery } from 'commons/types';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../hooks/useCreateOrEdit', () => ({
    useGetComponentInfo: jest.fn(),
    useTemplateFields: jest.fn(),
    useTemplate: jest.fn(),
    useTemplatePermissions: jest.fn(),
}));

// jest.mock('commons/types', () => ({
// useCreateTemplateMutation: jest.fn(),
// useUpdateTemplateMutation: jest.fn(),
// useGetTemplateByIdLazyQuery: jest.fn(),
// useGetObjectDefinitionsQuery: jest.fn(),
// useGenerateTemplateLazyQuery: jest.fn()
// }));

jest.mock('Commons/Components', () => ({
    ClassicDrawer: (props: any) => (
        <div>
            Drawer Component
            <button data-testid="onSubmit-drawer" onClick={() => props.onSubmit()}></button>
            {props.otherNodes}
            {props.children}
        </div>
    ),
}));
jest.mock('AWING', () => ({
    CircularProgress: () => <div data-testid="CircularProgress" />,
    DataForm: () => <div>DataForm Component</div>,
}));
jest.mock('../components/CompareSchema', () => () => <div>CompareSchema Component</div>);
jest.mock('../components/FunctionGrid', () => () => <div>FunctionGrid Component</div>);
jest.mock('../components/TemplateContent', () => () => <div>TemplateContent Component</div>);
jest.mock('Features/NOTIFICATION/components/TestingTool', () => (props: any) => (
    <div>
        TestingTool Component
        <button data-testid="onClose-testing-tool" onClick={() => props.onClose()}>
            onClose
        </button>
    </div>
));

const mockGetTemplates = jest.fn().mockReturnValue({
    roles: [],
    total: 0,
});
const mockDelete = jest.fn();
const mockGetTemplateById = jest.fn();
const mockCreateTemplate = jest.fn();
const mockUpdateTemplate = jest.fn();
const mockGenerateTemplate = jest.fn();
const mockGetObjectDefinitions = jest.fn();
export const services: TemplateServices = {
    getTemplates: mockGetTemplates,
    deleteNotificationTemplate: mockDelete,
    generateTemplate: mockGenerateTemplate,
    createTemplate: mockCreateTemplate,
    updateTemplate: mockUpdateTemplate,
    getObjectDefinitions: mockGetObjectDefinitions,
    getTemplateById: mockGetTemplateById,
};

const renderComponent = () => {
    render(
        <MemoryRouter>
            <TemplateContext.Provider
                value={{
                    services,
                    objectDefinitions: [],
                    objectTypeCodes: [],
                }}
            >
                <CreateOrEdit />
            </TemplateContext.Provider>
        </MemoryRouter>
    );
};

describe('CreateOrEdit Component', () => {
    // const mockCreateTemplate = jest.fn();
    // const mockUpdateTemplate = jest.fn();
    // const mockGenerateTemplate = jest.fn();
    const mockTemplateInput = {
        name: 'Test Template',
        content: 'Test Content',
        objectType: 'Test',
    };

    const defaultProps = {
        mode: FormMode.CREATE,
        templateId: undefined,
        testingDataInput: {},
        templateInput: mockTemplateInput,
        confirmExit: false,
        handleTestingChanged: jest.fn(),
        handleChangeContent: jest.fn(),
        handleChangeField: jest.fn(),
        readyForSubmit: true,
        readyForTesting: true,
        fieldPermissions: {},
        fields: [],
    };

    beforeEach(() => {
        (hooks.useGetComponentInfo as jest.Mock).mockReturnValue({
            mode: FormMode.CREATE,
            templateId: undefined,
        });
        (hooks.useTemplate as jest.Mock).mockReturnValue(defaultProps);
        (hooks.useTemplateFields as jest.Mock).mockReturnValue([]);
        (hooks.useTemplatePermissions as jest.Mock).mockReturnValue({});

        // (useCreateTemplateMutation as jest.Mock).mockReturnValue([mockCreateTemplate, { loading: false }]);
        // (useUpdateTemplateMutation as jest.Mock).mockReturnValue([mockUpdateTemplate, { loading: false }]);
        // (useGenerateTemplateLazyQuery as jest.Mock).mockReturnValue([mockGenerateTemplate, { loading: false }]);
        // (useGetObjectDefinitionsQuery as jest.Mock).mockReturnValue({
        //     loading: false,
        //     data: {
        //         objectDefinitions: {
        //             items: [{ id: 1, objectTypeCode: 'Test' }],
        //         },
        //     },
        // });
    });

    it('should render component', () => {
        renderComponent();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.getByText('Drawer Component')).toBeInTheDocument();
        expect(screen.getByText('DataForm Component')).toBeInTheDocument();
        expect(screen.getByText('CompareSchema Component')).toBeInTheDocument();
        expect(screen.getByText('FunctionGrid Component')).toBeInTheDocument();
        expect(screen.getByText('TemplateContent Component')).toBeInTheDocument();
    });

    it('should render component with null templateInput', () => {
        const defaultPropsWithNullTemplateInput = {
            mode: FormMode.CREATE,
            templateId: undefined,
            testingDataInput: {},
            templateInput: null,
            confirmExit: false,
            handleTestingChanged: jest.fn(),
            handleChangeContent: jest.fn(),
            handleChangeField: jest.fn(),
            readyForSubmit: true,
            readyForTesting: true,
            fieldPermissions: {},
            fields: [],
        };
        (hooks.useTemplate as jest.Mock).mockReturnValue(defaultPropsWithNullTemplateInput);
        renderComponent();
        expect(screen.getByText('Drawer Component')).toBeInTheDocument();
        expect(screen.getByText('DataForm Component')).toBeInTheDocument();
        expect(screen.getByText('CompareSchema Component')).toBeInTheDocument();
        expect(screen.getByText('FunctionGrid Component')).toBeInTheDocument();
        expect(screen.getByText('TemplateContent Component')).toBeInTheDocument();
    });

    it('should render component with formMode = EDIT', async () => {
        (hooks.useGetComponentInfo as jest.Mock).mockReturnValue({
            mode: FormMode.EDIT,
            templateId: 1,
        });
        (mockGetTemplateById as jest.Mock).mockResolvedValue({
            id: 1,
            name: 'Test Template',
        });
        renderComponent();

        expect(screen.queryByTestId('CircularProgress')).toBeInTheDocument();
        expect(screen.getByText('Drawer Component')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('DataForm Component')).toBeInTheDocument();
            expect(screen.getByText('CompareSchema Component')).toBeInTheDocument();
            expect(screen.getByText('FunctionGrid Component')).toBeInTheDocument();
            expect(screen.getByText('TemplateContent Component')).toBeInTheDocument();
        });
    });

    it('should render loading component', () => {
        (mockGetObjectDefinitions as jest.Mock).mockResolvedValue({});
        renderComponent();
        expect(screen.getByText('Drawer Component')).toBeInTheDocument();
    });

    it('should open/close testing tool', () => {
        renderComponent();
        fireEvent.click(screen.getByText('TestingTool.Name'));
        expect(screen.getByText('TestingTool Component')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('onClose-testing-tool'));
        expect(screen.queryByText('TestingTool Component')).not.toBeInTheDocument();
    });

    it('should handle submit when formMode = CREATE', () => {
        (mockCreateTemplate as jest.Mock).mockResolvedValue({});
        renderComponent();

        expect(screen.getByText('Drawer Component')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('onSubmit-drawer'));

        expect(mockCreateTemplate).toHaveBeenCalled();
    });

    it('should handle submit when formMode = EDIT', () => {
        (mockGetTemplateById as jest.Mock).mockResolvedValue({
            id: 1,
            name: 'Test Template',
        });
        (mockUpdateTemplate as jest.Mock).mockResolvedValue({});
        (hooks.useGetComponentInfo as jest.Mock).mockReturnValue({
            mode: FormMode.EDIT,
            templateId: 1,
        });
        renderComponent();

        expect(screen.getByText('Drawer Component')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('onSubmit-drawer'));

        expect(mockUpdateTemplate).toHaveBeenCalled();
    });
});
