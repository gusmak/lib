import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import StatePickerItem, { type OwnProps } from '../StatePickerItem';

// #region Render
const initProps: OwnProps = {
    eWorkflowStateIds: ['1', '4'],
    iWorkflowStateIds: ['1', '4'],
    onChangeStates: jest.fn(),
    rootState: { id: '1' },
    state: { id: '1', name: 'demo 1' },
    states: [
        { id: '1', name: 'demo 1', parentId: '0' },
        { id: '2', parentId: '1', name: 'demo 2' },
        { id: '3', parentId: '1', name: 'demo 3' },
    ],
};
const getRender = (props?: Partial<OwnProps>) => {
    render(<StatePickerItem {...initProps} {...props} />);
};
// #endregion

// #region Mock
jest.mock('@mui/x-tree-view', () => ({
    ...jest.requireActual('@mui/material'),
    TreeItem: (props: any) => (
        <div>
            <p data-testid={`TreeItem-header`}>TreeItem</p>
            <div>{props?.label}</div>
            {props?.children}
        </div>
    ),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Checkbox: (props: any) => (
        <div>
            <p data-testid="Material-Checkbox-header">Material Checkbox</p>
            <input data-testid="Material-Checkbox-input" type="checkbox" defaultChecked={props?.checked} />
            <button data-testid={`Material-Checkbox-onClick`} onClick={(e: any) => props?.onClick(e)} />
            <button data-testid={`Material-Checkbox-onChange`} onClick={(e: any) => props?.onChange(e.target.rootStateId)} />
        </div>
    ),
}));

// #endregion

describe('render', () => {
    it('should render null', () => {
        getRender({ state: { id: undefined } });

        expect(screen.queryByTestId('TreeItem-header')).toBeNull();
    });

    it('should render', () => {
        getRender();

        expect(screen.getAllByTestId('TreeItem-header')).toHaveLength(3);
    });

    it('should checked', () => {
        getRender({
            rootState: { id: undefined },
        });

        expect(screen.getAllByTestId('Material-Checkbox-input')[0]).toBeChecked();
        expect(screen.getAllByTestId('Material-Checkbox-input')[1]).toBeChecked();
    });
});

describe('Actions', () => {
    it('should stopPropagation', () => {
        const mockStopPropagation = jest.fn();
        getRender();
        fireEvent.click(screen.getAllByTestId('Material-Checkbox-onClick')[0], { stopPropagation: mockStopPropagation });
        fireEvent.click(screen.getAllByTestId('Material-Checkbox-onClick')[1], { stopPropagation: mockStopPropagation });

        waitFor(() => {
            expect(mockStopPropagation).toHaveBeenCalled();
        });
    });

    it('should call StatePickerItem onChangeStates', () => {
        const mockOnChangeStates = jest.fn();
        getRender({
            rootState: { id: '1' },
            onChangeStates: mockOnChangeStates,
        });
        fireEvent.click(screen.getAllByTestId('Material-Checkbox-onChange')[1]);

        waitFor(() => {
            expect(mockOnChangeStates).toHaveBeenCalled();
        });
    });
});
