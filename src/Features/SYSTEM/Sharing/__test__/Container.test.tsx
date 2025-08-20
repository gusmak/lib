/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router';
import * as recoil from 'jotai';
import SharingContainer from '../Container';
import { resetAllWorkspaceSharingState } from '../Atoms';
import { Sharing, WorkSpaceState } from '../Types';
import { useAppHelper } from 'Context';
import { useTranslation } from 'react-i18next';
import { Provider } from 'jotai';
import { sharingPropsContext as SharingContext } from '../Context';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const fakeSharings: Sharing[] = [
    {
        id: 1,
        objectFilterId: 1,
        workspaceId: 1,
        totalTargetWorkspace: 1,
        sharingWorkspaces: [],
        name: 'Sharing 1',
    },
    {
        id: 2,
        objectFilterId: 1,
        workspaceId: 1,
        totalTargetWorkspace: 1,
        sharingWorkspaces: [],
        name: 'Sharing 2',
    },
];

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('react-router', () => ({
    useNavigate: jest.fn(),
}));

jest.mock('Context', () => ({
    useAppHelper: jest.fn(),
}));

jest.mock('AWING', () => {
    return {
        PageManagement: (props: any) => {
            props.showNotificationSuccess();
            props.columns
                .filter((x: any) => x.dynamicTableCellProps)
                .forEach((c: any) => {
                    c.dynamicTableCellProps(fakeSharings[0]);
                    c.dynamicTableCellProps({});
                });
            return (
                <div>
                    <button
                        data-testid="onChangeQueryInput"
                        onClick={() => {
                            props.onChangeQueryInput({
                                advancedObject: {
                                    status: '0',
                                    priority: '0',
                                    type: '1',
                                    directoryId: '4684432198852342857',
                                    date: ['111', '222'],
                                },
                                id: '0',
                                searchString: '',
                                pageIndex: 0,
                                pageSize: 10,
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
                            <div key={idx} data-testid={getter.field}>
                                {getter.valueGetter(fakeSharings[0], idx)}
                            </div>
                        ))}
                    <span data-testid="rowid">{props.getRowId(fakeSharings[0])}</span>
                    <button data-testid="CreateBtn" onClick={props.onCreateButtonClick} />
                    <button
                        data-testid="Rowclick"
                        onClick={() => {
                            props.onRowClick(fakeSharings[0].id, {
                                currentTarget: {
                                    dataset: {
                                        row: 'row',
                                    },
                                },
                            });
                            props.onRowClick(fakeSharings[0].id, {
                                currentTarget: {
                                    dataset: {
                                        row: '',
                                    },
                                },
                            });
                        }}
                    >
                        Rowclick
                    </button>
                    <button
                        data-testid="onDelete"
                        onClick={() => {
                            props.onDelete('onDelete');
                        }}
                    >
                        Remove Btn
                    </button>
                    <p>{JSON.stringify(props.rows)}</p>
                </div>
            );
        },
    };
});

const mockGetWorkspaceSharingById = jest.fn();
const mockCreateWorkspaceSharing = jest.fn();
const mockUpdateWorkspaceSharing = jest.fn();
const mockGetSharings = jest.fn();
const mockGetSchemasQuery = jest.fn();
const mockGetWorkspaces = jest.fn();
const mockGetWorkspaceById = jest.fn();
const mockDeleteWorkspaceSharing = jest.fn();
const mockGetObjectFilters = jest.fn();

const renderUi = () => {
    return render(
        <Provider>
            <SharingContext.Provider
                value={{
                    getSharingById: mockGetWorkspaceSharingById,
                    createWorkspaceSharing: mockCreateWorkspaceSharing,
                    updateWorkspaceSharing: mockUpdateWorkspaceSharing,
                    getSharings: mockGetSharings,
                    getSchemas: mockGetSchemasQuery,
                    getWorkspaces: mockGetWorkspaces,
                    getWorkspaceById: mockGetWorkspaceById,
                    deleteWorkspaceSharing: mockDeleteWorkspaceSharing,
                    getObjectFilters: mockGetObjectFilters,
                    isLoading: false,
                    isSubmitLoading: false,
                    currentWorkspaceState: {
                        read: function (
                            get: <Value>(atom: recoil.Atom<Value>) => Value,
                            options: { readonly signal: AbortSignal; readonly setSelf: never }
                        ): WorkSpaceState {
                            throw new Error('Function not implemented.');
                        },
                    },
                }}
            >
                <SharingContainer />
            </SharingContext.Provider>
        </Provider>
    );
};
const mockNavigate = jest.fn();
const mockAppHelper = {
    confirm: jest.fn(),
    snackbar: jest.fn(),
};

describe('SharingContainer', () => {
    const t = jest.fn((key) => key);
    beforeEach(() => {
        (useTranslation as jest.Mock).mockReturnValue({ t });
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useAppHelper as jest.Mock).mockReturnValue(mockAppHelper);

        mockGetWorkspaces.mockResolvedValue({});
        mockGetSchemasQuery.mockResolvedValue([]);
        mockGetSharings.mockResolvedValue(fakeSharings);

        jest.spyOn(recoil, 'useSetAtom').mockImplementation((atom) => {
            if (atom === resetAllWorkspaceSharingState) return jest.fn();
            return jest.fn();
        });
        jest.spyOn(recoil, 'useAtomValue').mockImplementation((atom) => {
            if (atom === resetAllWorkspaceSharingState) return {};
            return jest.fn();
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders with zero data', () => {
        renderUi();
    });
    it('renders without crashing', async () => {
        renderUi();
        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument();
        });
    });

    it('call action', async () => {
        renderUi();
        await waitFor(() => {
            fireEvent.click(screen.getByTestId('CreateBtn'));
            fireEvent.click(screen.getByTestId('onChangeQueryInput'));
            fireEvent.click(screen.getByTestId('Rowclick'));
            fireEvent.click(screen.getByTestId('onDelete'));
        });
    });
});
