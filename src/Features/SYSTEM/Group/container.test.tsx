import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import UserGroupContainer from './container';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAppHelper } from '../../../Context';
import { useGetGroupsLazyQuery, useGetRolesLazyQuery, useDeleteGroupMutation } from '../Generated/graphql';

const resData = [
    {
        id: 1,
        name: 'Role 01',
        description: 'Role Description 01',
    },
    {
        id: 2,
        name: 'Role 02',
        description: 'Role Description 02',
        roleTagIds: [1, 2],
    },
];

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('react-router', () => ({
    useNavigate: jest.fn(),
}));

jest.mock('../../../Context', () => ({
    useAppHelper: jest.fn(),
}));

jest.mock('../Generated/graphql', () => ({
    useGetGroupsLazyQuery: jest.fn(),
    useGetRolesLazyQuery: jest.fn(),
    useDeleteGroupMutation: jest.fn(),
}));

jest.mock('../../../AWING', () => ({
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
            // if (s.field !== 'roleTagIds.name')
            return s.valueGetter(resData[1], index);
            // else {
            //     return 'Role Group 01';
            // }
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

const mockNavigate = jest.fn();
const mockDelete = jest.fn();

const mockAppHelper = {
    confirm: jest.fn(),
    snackbar: jest.fn(),
};

describe('UserGroupContainer', () => {
    const t = jest.fn((key) => key);
    const navigate = jest.fn();
    const confirm = jest.fn();
    const snackbar = jest.fn();

    beforeEach(() => {
        (useTranslation as jest.Mock).mockReturnValue({ t });
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useAppHelper as jest.Mock).mockReturnValue(mockAppHelper);
        (useGetGroupsLazyQuery as jest.Mock).mockReturnValue([jest.fn(), { data: null, loading: false }]);
        (useGetRolesLazyQuery as jest.Mock).mockReturnValue([jest.fn(), { data: null, loading: false }]);
        (useDeleteGroupMutation as jest.Mock).mockReturnValue([jest.fn()]);
    });

    it('should render the component', () => {
        render(
            <MockedProvider>
                <UserGroupContainer />
            </MockedProvider>
        );

        // expect(screen.getByText('UserGroup.Title')).toBeInTheDocument();
    });

    // it('should call navigate on create button click', () => {
    //     render(
    //         <MockedProvider>
    //             <UserGroupContainer />
    //         </MockedProvider>
    //     );

    //     const createButton = screen.getByText('Create');
    //     fireEvent.click(createButton);

    //     expect(navigate).toHaveBeenCalledWith('/create-path');
    // });

    // it('should call navigate on row click', () => {
    //     const mockData = {
    //         groups: {
    //             items: [{ id: '1', name: 'Group 1', description: 'Description 1', users: [] }],
    //             totalCount: 1,
    //         },
    //     };

    //     (useGetGroupsLazyQuery as jest.Mock).mockReturnValue([jest.fn(), { data: mockData, loading: false }]);

    //     render(
    //         <MockedProvider>
    //             <UserGroupContainer />
    //         </MockedProvider>
    //     );

    //     const row = screen.getByText('Group 1');
    //     fireEvent.click(row);

    //     expect(navigate).toHaveBeenCalledWith('/edit-path/1');
    // });

    // it('should show success notification on delete', async () => {
    //     const deleteUserGroup = jest.fn().mockResolvedValue({});
    //     (useDeleteGroupMutation as jest.Mock).mockReturnValue([deleteUserGroup]);

    //     render(
    //         <MockedProvider>
    //             <UserGroupContainer />
    //         </MockedProvider>
    //     );

    //     const deleteButton = screen.getByText('Delete');
    //     fireEvent.click(deleteButton);

    //     expect(confirm).toHaveBeenCalled();
    //     await deleteUserGroup();
    //     expect(snackbar).toHaveBeenCalledWith('success');
    // });
    it('Show called showNotificationSuccess', async () => {
        render(
            <MockedProvider>
                <UserGroupContainer />
            </MockedProvider>
        );
        fireEvent.click(screen.getByTestId('btnShowNotificationSuccess'));

        await waitFor(() => {
            expect(mockAppHelper.snackbar).toHaveBeenCalled();
        });
    });
    it('Show called create', async () => {
        render(
            <MockedProvider>
                <UserGroupContainer />
            </MockedProvider>
        );
        fireEvent.click(screen.getByTestId('CreateBtn'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });
    });
    it('Show row click', async () => {
        render(
            <MockedProvider>
                <UserGroupContainer />
            </MockedProvider>
        );
        fireEvent.click(screen.getByTestId('Rowclick'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });
    });
    it('Show called Delete', async () => {
        render(
            <MockedProvider>
                <UserGroupContainer />
            </MockedProvider>
        );
        fireEvent.click(screen.getByTestId('btnDelete'));
    });
});
