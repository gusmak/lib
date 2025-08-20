import { render, screen, fireEvent } from '@testing-library/react';
import AllWorkspaceConfig from '../AllWorkspaceConfig';
// import { WorkspaceOptionsState } from '../../Atoms';
import { Provider } from 'jotai';
import React, { useState as useStateMock } from 'react';

jest.mock('Commons/Components/ClassicDrawer', () => {
    return ({ children, onClearWorkspace, onSubmit }: any) => (
        <div data-testid="classic-drawer">
            {children}
            <button data-testid="clear-button" onClick={onClearWorkspace}>
                clear
            </button>
            <button data-testid="submit-button" onClick={onSubmit}>
                Submit
            </button>
        </div>
    );
});

jest.mock('./AddOrEditConfig', () => {
    const { SharingConfigParamType } = require('../Types');
    return ({ onChangeConfigurations, onClearWorkspace, selectedId }: any) => (
        <div data-testid={`AddOrEditConfig-${selectedId}`}>
            <button data-testid={`clear-button-${selectedId}`} onClick={() => onClearWorkspace(selectedId)}>
                Clear
            </button>
            <button
                data-testid={`change-button-${selectedId}`}
                onClick={() => onChangeConfigurations([{ id: 1, paramName: 'test', paramValue: 'value' }], SharingConfigParamType.Schema)}
            >
                Change
            </button>
        </div>
    );
});

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

describe('AllWorkspaceConfig', () => {
    const defaultProps = {
        workspaces: [{ targetWorkspaceId: 1 }, { targetWorkspaceId: 2 }],
        filter: ['filter1'],
        schema: ['schema1'],
        onChangeMultiConfigurations: jest.fn(),
    };
    const setState = jest.fn();
    const setConfirmExit = jest.fn();
    const setWorkspacesSelected = jest.fn();
    const setConfigurationsByWorkspaceId = jest.fn();

    beforeEach(() => {
        (useStateMock as jest.Mock).mockImplementation((init) => [init, setState]);
    });

    // const initialRecoilState = ({ set }: any) => {
    //     set(WorkspaceOptionsState, [
    //         { id: 1, name: 'Workspace 1', customerId: '1' },
    //         { id: 2, name: 'Workspace 2', customerId: '2' },
    //         { id: 3, name: 'Workspace 3', customerId: '3' },
    //     ]);
    // };

    it('should render without crashing', () => {
        render(
            <Provider>
                <AllWorkspaceConfig {...defaultProps} />
            </Provider>
        );
        expect(screen.getByTestId('classic-drawer')).toBeInTheDocument();
    });

    it('should render null instead of AddOrEditConfig', () => {
        (React.useState as jest.Mock)
            .mockImplementationOnce((init) => [init, jest.fn()]) // Mock init
            .mockImplementationOnce((init) => [init, setConfirmExit])
            .mockImplementationOnce(() => [[1], setWorkspacesSelected]);
        render(
            <Provider>
                <AllWorkspaceConfig {...defaultProps} />
            </Provider>
        );
        expect(screen.getByTestId('classic-drawer')).toBeInTheDocument();
        expect(screen.queryByText('AddOrEditConfig component')).not.toBeInTheDocument();
    });

    it('handles submit', () => {
        (React.useState as jest.Mock)
            .mockImplementationOnce((init) => [init, jest.fn()]) // Mock init
            .mockImplementationOnce((init) => [init, setConfirmExit])
            .mockImplementationOnce(() => [[1], setWorkspacesSelected])
            // Mock workspacesSelected
            .mockImplementationOnce(() => [[{ id: 1, filter: [], schema: [] }], setConfigurationsByWorkspaceId]);
        const props = {
            ...defaultProps,
            filter: [],
        };
        render(
            <Provider>
                <AllWorkspaceConfig {...props} />
            </Provider>
        );
        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton.closest('button')).not.toBeDisabled();

        fireEvent.click(submitButton);
    });

    it('should call onClearWorkspace when clear button is clicked', () => {
        (React.useState as jest.Mock)
            .mockImplementationOnce((init) => [init, jest.fn()]) // Mock init
            .mockImplementationOnce((init) => [init, setConfirmExit])
            .mockImplementationOnce(() => [[1], setWorkspacesSelected])
            // Mock workspacesSelected
            .mockImplementationOnce(() => [[{ id: 1, filter: [], schema: [] }], setConfigurationsByWorkspaceId]);
        render(
            <Provider>
                <AllWorkspaceConfig {...defaultProps} />
            </Provider>
        );
        const clearButton = screen.getByTestId('clear-button');
        fireEvent.click(clearButton);
        expect(screen.queryByTestId('AddOrEditConfig-1')).toBeInTheDocument();

        const clearButton1 = screen.getByTestId('clear-button-1');
        fireEvent.click(clearButton1);

        const setWorkspacesSelectedCallback = setWorkspacesSelected.mock.calls[1][0];
        setWorkspacesSelectedCallback([1]);
        const setConfigurationsByWorkspaceIdCallback = setConfigurationsByWorkspaceId.mock.calls[1][0];
        setConfigurationsByWorkspaceIdCallback([{ id: 1 }]);

        expect(setWorkspacesSelected).toHaveBeenCalled();
        expect(setConfigurationsByWorkspaceId).toHaveBeenCalled();
    });

    it('should call onChangeConfigurations when change button is clicked', () => {
        (React.useState as jest.Mock)
            .mockImplementationOnce((init) => [init, jest.fn()]) // Mock init
            .mockImplementationOnce((init) => [init, setConfirmExit])
            .mockImplementationOnce(() => [[1, 2], setWorkspacesSelected])
            // Mock workspacesSelected
            .mockImplementationOnce(() => [
                [
                    { id: 1, filter: [], schema: [] },
                    { id: 2, filter: [], schema: [] },
                ],
                setConfigurationsByWorkspaceId,
            ]);
        render(
            <Provider>
                <AllWorkspaceConfig {...defaultProps} />
            </Provider>
        );
        const changeButton = screen.getByTestId('change-button-1');
        fireEvent.click(changeButton);
        expect(setConfigurationsByWorkspaceId).toHaveBeenCalled();
    });
});
