import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import StatePicker, { type OwnProps } from '../StatePicker';

// #region Render
const initProps: OwnProps = {
    eWorkflowStateIds: [],
    iWorkflowStateIds: [],
    onChangeStates: jest.fn(),
    states: [],
    rootState: {},
};
const getRender = (props?: Partial<OwnProps>) => {
    render(<StatePicker {...initProps} {...props} />);
};
// #endregion

// #region Mock
jest.mock('@mui/x-tree-view', () => ({
    ...jest.requireActual('@mui/material'),
    SimpleTreeView: (props: any) => (
        <div>
            <p data-testid="SimpleTreeView-header">SimpleTreeView</p>
            <p data-testid="SimpleTreeView-expandedItems">{props?.expandedItems.map((i: any) => i)}</p>
            <button
                data-testid="SimpleTreeView-onExpandedItemsChange"
                onClick={(e: any) => props?.onExpandedItemsChange({}, e.target.nodeIds)}
            />
            {props?.children}
        </div>
    ),
    TreeItem: (props: any) => (
        <div>
            <p data-testid="TreeItem-header">TreeItem</p>
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
            <button data-testid={`Material-Checkbox-onClick`} onClick={(e: any) => props?.onClick(e)} />
            <button data-testid={`Material-Checkbox-onChange`} onClick={(e: any) => props?.onChange(e.target.rootStateId)} />
        </div>
    ),
}));

jest.mock('../StatePickerItem', () => ({
    __esModule: true,
    default: (props: any) => {
        return (
            <div>
                <p data-testid={`StatePickerItem-header-${props?.state?.id}`}>StatePickerItem</p>
                <button data-testid={`StatePickerItem-onChangeStates-${props?.state?.id}`} onClick={props?.onChangeStates} />
            </div>
        );
    },
}));
// #endregion

describe('render', () => {
    it('should render', () => {
        getRender();

        expect(screen.getByTestId('SimpleTreeView-header')).toBeInTheDocument();
    });

    it('should render StatePickerItem', () => {
        getRender({
            states: [{ id: '1' }, { id: '2' }],
        });

        expect(screen.getByTestId('StatePickerItem-header-1')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should call SimpleTreeView onExpandedItemsChange', () => {
        // const mockStopPropagation = jest.fn();
        getRender();
        fireEvent.click(screen.getByTestId('SimpleTreeView-onExpandedItemsChange'), {
            target: {
                nodeIds: ['root1'],
            },
        });
        expect(screen.getByTestId('SimpleTreeView-expandedItems')).toHaveTextContent('root1');
    });

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
