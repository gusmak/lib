import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router';
import { I18nProvider, i18nLib } from 'translate';
import { useAppHelper } from 'Context';
import CreateOrEdit from '../CreateOrEdit';
import { ObjectFilterServices } from '../Services';
import { ObjectFilterContext } from '../context';
import { initObjectFilter } from './servicesData';
import { checkValid } from '../utils';
import { getDifferentFieldsValue } from '../utils';

// Mock dependencies
jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({ t: jest.fn((key) => key) }),
}));

jest.mock('Context', () => ({
    ...jest.requireActual('Context'),
    useAppHelper: jest.fn(),
    AppContext: {
        Provider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    },
}));

jest.mock('../utils', () => ({
    checkValid: jest.fn(),
    getDifferentFieldsValue: jest.fn(),
}));

jest.mock('react-router', () => ({
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

const mockUpdate = jest.fn();

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Button: (props: any) => (
        <div>
            <p>TestingTool.Name</p>,
            <button data-testid="Button-TestingTool-onClick" onClick={props.onClick} />
        </div>
    ),
}));

// #region Mock AWING
jest.mock('AWING', () => ({
    textValidation: () => ({ valid: true, message: '' }),
    CircularProgress: () => <div>CircularProgress Component</div>,
    DataForm: (props: any) => {
        props.onUpdate && mockUpdate(props.onUpdate);

        return (
            <div>
                <div>
                    <div>{props.oldValue?.objectTypeCode}</div>
                </div>
                <button
                    data-testid="data-form-update"
                    onClick={() =>
                        props.onUpdate({
                            objectTypeCode: 'campagin',
                            // roleDescription: "Role's Description 01",
                            // roleTagIds: [1],
                        })
                    }
                >
                    Update
                </button>
            </div>
        );
    },
    FIELD_TYPE: {
        SELECT: 'select',
        TEXT: 'text',
        LOGIC_EXPRESSION: 'logic-expression',
    },
}));
// #endregion

// #region Mock Commons
jest.mock('Commons/Components', () => ({
    ClassicDrawer: (props: any) => {
        return (
            <div>
                Drawer Component
                <h6 data-testid="drawer-title">{props?.title}</h6>
                <button data-testid="drawer-submit" onClick={props.onSubmit}>
                    Submit
                </button>
                <button
                    data-testid="custom-action-button"
                    onClick={() => {
                        props.customAction?.props?.onChange({
                            target: { value: 500 },
                        });
                    }}
                >
                    {props.customAction?.props?.label}
                </button>
                <div>{props.otherNodes}</div>
                <div>{props.children}</div>
            </div>
        );
    },
}));
// #endregion

jest.mock('Features/NOTIFICATION/components/TestingTool', () => ({
    __esModule: true,
    default: (props: any) => (
        <div>
            <p data-testid="NotificationTestingTool-header">NotificationTestingTool</p>
            <button data-testid="NotificationTestingTool-onChange" onClick={props?.onChange} />
            <button data-testid="NotificationTestingTool-onClose" onClick={props?.onClose} />
        </div>
    ),
}));

const mockGetObjectFilters = jest.fn();
const mockCreateObjectFilter = jest.fn();
const mockUpdateObjectFilter = jest.fn();
const mockGetObjectFilterById = jest.fn();
const mockDelete = jest.fn();

export const services: ObjectFilterServices = {
    getObjectFilters: mockGetObjectFilters,
    createObjectFilter: mockCreateObjectFilter,
    updateObjectFilter: mockUpdateObjectFilter,
    getObjectFilterById: mockGetObjectFilterById,
    deleteObjectFilter: mockDelete,
};

const UI = () => {
    return (
        <I18nProvider i18nData={i18nLib}>
            <ObjectFilterContext.Provider
                value={{
                    services,
                    objectTyeCodes: [],
                    logicExpressionsStructure: {},
                }}
            >
                <CreateOrEdit />
            </ObjectFilterContext.Provider>
        </I18nProvider>
    );
};
const renderUi = () => render(<UI />);

/** mocks value */
const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => ({ id: '1' }));

const mockAppHelper = {
    confirm: jest.fn(),
    snackbar: jest.fn(),
};

beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue(mockUseParams);
    (useAppHelper as jest.Mock).mockReturnValue(mockAppHelper);
    (checkValid as jest.Mock).mockReturnValue(true);
    (getDifferentFieldsValue as jest.Mock).mockReturnValue({
        name: 'name update',
    });

    mockGetObjectFilters.mockResolvedValue({
        items: [],
        total: 0,
    });
    mockGetObjectFilterById.mockResolvedValue({});
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('render', () => {
    it('should show CircularProgress', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        renderUi();

        expect(screen.getByText('CircularProgress Component')).toBeInTheDocument();
    });

    it('should show Drawer title', () => {
        renderUi();

        expect(screen.getByText('Drawer Component')).toBeInTheDocument();
    });

    it('should is Create', () => {
        (useParams as jest.Mock).mockReturnValue({ id: undefined });
        renderUi();

        expect(screen.getByTestId('drawer-title')).toHaveTextContent('Filter.Create');
    });

    it('should is Edit', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        renderUi();

        expect(screen.getByTestId('drawer-title')).toHaveTextContent('Filter.Edit');
    });

    it('should checkValid is false', () => {
        (checkValid as jest.Mock).mockReturnValue(false);
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        renderUi();

        expect(screen.getByTestId('drawer-title')).toHaveTextContent('Filter.Edit');
    });
});

describe('actions', () => {
    it('should call onSubmit when Create', () => {
        (useParams as jest.Mock).mockReturnValue({ id: undefined });
        renderUi();

        fireEvent.click(screen.getByTestId('drawer-submit'));
        expect(mockCreateObjectFilter).toHaveBeenCalled();
    });

    it('should call update of editing', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '246' });
        mockGetObjectFilterById.mockResolvedValue({
            objectFilter: initObjectFilter[0],
        });
        renderUi();

        await waitFor(() => {
            fireEvent.click(screen.getByTestId('data-form-update'));
        });
    });

    it('should call update of create', () => {
        (useParams as jest.Mock).mockReturnValue({ id: undefined });
        renderUi();

        fireEvent.click(screen.getByTestId('data-form-update'));
    });

    it('should call onSubmit when Edit', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        renderUi();

        fireEvent.click(screen.getByTestId('drawer-submit'));
        expect(mockUpdateObjectFilter).toHaveBeenCalled();
    });

    it('should show testing tool, and change it', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('Button-TestingTool-onClick'));
        fireEvent.click(screen.getByTestId('NotificationTestingTool-onChange'));

        await waitFor(() => {
            expect(screen.getByTestId('NotificationTestingTool-header')).toBeInTheDocument();
        });
    });

    it('should close testing tool', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('Button-TestingTool-onClick'));
        fireEvent.click(screen.getByTestId('NotificationTestingTool-onClose'));

        await waitFor(() => {
            expect(screen.queryByTestId('NotificationTestingTool-header')).not.toBeInTheDocument();
        });
    });
});
