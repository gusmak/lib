import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useAppHelper } from 'Context';
import { useNavigate } from 'react-router';
import SubscriptionConfigContainer from '../container';
import { SubscriptionConfigContext } from '../context';
import { SubscriptionConfigServices } from '../Services';
import { SubscriptionConfigsType } from '../types';
import { ScheduleType } from '../enums';
import { act } from 'react';

const resData: SubscriptionConfigsType[] = [
    {
        id: 1,
        objectType: 'MEDIA_PLAN',
        name: '(TEST) Subscription về các MediaPlan có status=300',
        status: false,
        scheduleType: ScheduleType.Daily,
        scheduleSummary: '8 15 * * * *',
        scheduleExpression: '8 15 * * * *',
        scheduleIntervalDaysOfWeek: '',
        scheduleIntervalDaysOfMonth: '',
        scheduleIntervalFromTime: '',
        scheduleIntervalEndTime: '',
        scheduleIntervalInMinutes: 0,
        outputFieldPermission: {
            objectDefinitionWithPermissions: [
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'id',
                        fieldPath: '.id.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'name',
                        fieldPath: '.name.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'objectType',
                        fieldPath: '.objectType.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleType',
                        fieldPath: '.scheduleType.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleSummary',
                        fieldPath: '.scheduleSummary.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleIntervalDaysOfWeek',
                        fieldPath: '.scheduleIntervalDaysOfWeek.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleIntervalDaysOfMonth',
                        fieldPath: '.scheduleIntervalDaysOfMonth.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleIntervalFromTime',
                        fieldPath: '.scheduleIntervalFromTime.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleIntervalEndTime',
                        fieldPath: '.scheduleIntervalEndTime.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleStartDate',
                        fieldPath: '.scheduleStartDate.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleIntervalInMinutes',
                        fieldPath: '.scheduleIntervalInMinutes.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleToDate',
                        fieldPath: '.scheduleToDate.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleExpression',
                        fieldPath: '.scheduleExpression.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'subscriptionConfigDetails',
                        fieldPath: '.subscriptionConfigDetails.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
            ],
        },
    },
];

jest.mock('Context', () => ({
    ...jest.requireActual('Context'),
    useAppHelper: jest.fn(),
}));

jest.mock('react-router', () => ({
    useNavigate: jest.fn(),
}));

jest.mock('AWING', () => ({
    PageManagement: (props: any) => {
        props.onChangeQueryInput({
            searchString: '',
            pageIndex: 0,
            sortModel: [
                {
                    field: 'id',
                    sort: 'asc',
                },
                {
                    field: 'name',
                    sort: 'desc',
                },
            ],
        });

        const getValue = (s: any, index: number) => {
            return s.valueGetter(resData[0], index);
        };

        return (
            <div>
                <span data-testid="page-label">{props.title}</span>
                <button
                    data-testid="changedQueryInput"
                    onClick={() => {
                        props.onChangeQueryInput({
                            searchString: '1',
                            pageIndex: 0,
                            pageSize: 10,
                        });
                    }}
                />
                <button
                    data-testid="changedQueryInputPageZize"
                    onClick={() => {
                        props.onChangeQueryInput({
                            searchString: '1',
                            pageIndex: 1,
                            pageSize: 20,
                        });
                    }}
                />
                <button
                    data-testid="removeQueryInput"
                    onClick={() => {
                        props.onChangeQueryInput({
                            advancedObject: {},
                            searchString: '',
                            pageIndex: 0,
                        });
                    }}
                />
                {(props.columns as any[])
                    .filter((item) => item.valueGetter)
                    .map((getter, idx) => (
                        <span key={idx} data-testid={getter.field}>
                            {getValue(getter, idx)}
                        </span>
                    ))}

                <span data-testid="rowid">{props.getRowId(resData[0])}</span>
                <button data-testid="CreateBtn" onClick={props.onCreateButtonClick} />
                <button
                    data-testid="Rowclick"
                    onClick={() => {
                        props.onRowClick(resData[0].id, {
                            target: { cellIndex: 1 },
                        });
                    }}
                >
                    Rowclick
                </button>
                <button
                    data-testid="btnDelete"
                    onClick={() => {
                        props.onDelete(resData[0].id);
                    }}
                >
                    Remove Btn
                </button>
                <button
                    data-testid="btnShowNotificationSuccess"
                    onClick={() => {
                        props.showNotificationSuccess();
                    }}
                >
                    Remove call showNotificationSuccess
                </button>
                <p>{JSON.stringify(resData)}</p>
                <span data-testid="totalItemCount">totalItemCount: {resData.length}</span>
            </div>
        );
    },
}));

jest.mock('Commons/Constant', () => ({
    Constants: {
        CREATE_PATH: 'create',
        EDIT_PATH: 'edit',
        PAGE_SIZE_DEFAULT: 10,
        PERMISSION_CODE: {
            FULL_CONTROL: 31,
        },
    },
}));

const mockDelete = jest.fn();
const mockGetSubscriptionConfigs = jest.fn();
const mockGetById = jest.fn();
const mockCreateSubscriptionConfig = jest.fn();
const mockUpdateSubscriptionConfig = jest.fn();
const mockGetObjectFilter = jest.fn();
const mockGetSubscriptionTemplates = jest.fn();
const mockGetUsers = jest.fn();
const mockGetUserGroups = jest.fn();

export const services: SubscriptionConfigServices = {
    getSubscriptionConfigs: mockGetSubscriptionConfigs,
    deleteSubscriptionConfig: mockDelete,
    getById: mockGetById,
    createSubscriptionConfig: mockCreateSubscriptionConfig,
    updateSubscriptionConfig: mockUpdateSubscriptionConfig,
    getObjectFilter: mockGetObjectFilter,
    getSubscriptionTemplates: mockGetSubscriptionTemplates,
    getUsers: mockGetUsers,
    getUserGroups: mockGetUserGroups,
};

const mockNavigate = jest.fn();

const mockAppHelper = {
    confirm: jest.fn(),
    snackbar: jest.fn(),
};

const renderUi = () => {
    return render(
        <SubscriptionConfigContext.Provider
            value={{
                services,
            }}
        >
            <SubscriptionConfigContainer />
        </SubscriptionConfigContext.Provider>
    );
};

beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAppHelper as jest.Mock).mockReturnValue(mockAppHelper);
    mockGetSubscriptionConfigs.mockResolvedValue({
        subscriptionConfigs: {
            items: resData,
            totalItemCount: resData.length,
        },
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('NotificationConfigContainer', () => {
    it('should render PageManagement component', () => {
        renderUi();
        expect(screen.getByTestId('page-label')).toBeInTheDocument();
    });

    it('Should render roles correctly', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('changedQueryInput'));

        await waitFor(() => {
            expect(screen.getByText(JSON.stringify(resData))).toBeInTheDocument();
        });
    });

    it('Should render totalItemCount', async () => {
        renderUi();
        await waitFor(() => {
            expect(screen.getByTestId('totalItemCount')).toHaveTextContent('totalItemCount: 1');
        });
    });
});

describe('actions', () => {
    it('Show called create', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('CreateBtn'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });
    });

    it('Show row click', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('Rowclick'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });
    });

    it('Show called Delete with case error', async () => {
        renderUi();
        await act(async () => {
            fireEvent.click(screen.getByTestId('changedQueryInput'));
        });
        await act(async () => {
            fireEvent.click(screen.getByTestId('btnDelete'));
        });

        await waitFor(() => {
            expect(mockGetSubscriptionConfigs).toHaveBeenCalled();
        });
    });

    it('Show called showNotificationSuccess', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('btnShowNotificationSuccess'));

        await waitFor(() => {
            expect(mockAppHelper.snackbar).toHaveBeenCalled();
        });
    });

    it('Show changed query input', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('changedQueryInput'));

        await waitFor(async () => {
            expect(mockGetSubscriptionConfigs).toHaveBeenCalled();
        });
    });

    it('Show changed query input page size', async () => {
        renderUi();

        fireEvent.click(screen.getByTestId('changedQueryInputPageZize'));

        await waitFor(async () => {
            expect(mockGetSubscriptionConfigs).toHaveBeenCalled();
        });
    });
});
