import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { rootSchemasState } from '../../Atoms';
import Container, { type OwnProps } from '../SchemaRow';

const initProps: OwnProps = {
    disableSelectSchema: false,
    explicitPermission: { schemaId: 1, permissions: [], workflowStateIds: [] },
    inheritedPermissions: [
        {
            schemaId: 1,
            permissions: [],
            workflowStateIds: [],
        },
    ],
    index: 0,
    onChangePermission: jest.fn(),
    onChangeStates: jest.fn(),
    onDeleteSchema: jest.fn(),
    schemaId: 1,
    schemas: [
        {
            id: 1,
            name: 'Schema 1',
        },
    ],
    workflow: {},
};

const getRender = (props?: Partial<OwnProps>) => {
    const initialRecoilState = ({ set }: any) => {
        set(rootSchemasState, []);
    };
    return render(
        <Provider initializeState={initialRecoilState}>
            <Container {...initProps} {...props} />
        </Provider>
    );
};

// #region Mocks
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    TableCell: (props: any) => (
        <div>
            <p data-testid="TableCell-header">TableCell</p>
            <button data-testid="TableCell-onClick" onClick={props?.onClick} />
            {props?.children}
        </div>
    ),
    Checkbox: (props: any) => (
        <div>
            <p data-testid="Material-Checkbox-header">Material Checkbox</p>
            <input data-testid="Material-Checkbox-input" type="checkbox" defaultChecked={props?.checked} />
            <button data-testid={`Material-Checkbox-onChange`} onClick={props?.onChange} />
        </div>
    ),
    IconButton: (props: any) => (
        <div>
            <button data-testid="IconButton-onClick" onClick={props?.onClick} />
            {props?.children}
        </div>
    ),
}));

jest.mock('@mui/icons-material', () => ({
    ...jest.requireActual('@mui/icons-material'),
    Clear: () => <p data-testid="Icon-Clear" />,
    ExpandLess: () => <p data-testid="Icon-ExpandLess" />,
    ExpandMore: () => <p data-testid="Icon-ExpandMore" />,
}));

jest.mock('../StatePicker', () => ({
    __esModule: true,
    default: (props: any) => (
        <div>
            <p data-testid="StatePicker-header">StatePicker</p>
            <button data-testid={`StatePicker-onChangeStates`} onClick={(e: any) => props?.onChangeStates(e.target.stateId)} />
        </div>
    ),
}));
// #endregion

describe('render', () => {
    it('should render', () => {
        getRender();
        expect(screen.getAllByTestId('TableCell-header'));
    });

    it('should render StatePicker', () => {
        getRender({
            workflow: {
                workflowStates: [
                    {
                        id: '1',
                        name: 'State 1',
                    },
                    {
                        id: '2',
                        name: 'State 2',
                    },
                ],
            },
        });
        expect(screen.getAllByTestId('StatePicker-header'));
    });

    it('should render disableSelectSchema is true', () => {
        getRender({
            disableSelectSchema: true,
        });
        expect(screen.getByTestId('Icon-Clear'));
    });
});

describe('Actions', () => {
    it('should handleOpen', () => {
        const mockOnChangePermission = jest.fn();
        getRender({
            onChangePermission: mockOnChangePermission,
        });
        fireEvent.click(screen.getAllByTestId('TableCell-onClick')[0]);
        fireEvent.click(screen.getAllByTestId('Material-Checkbox-onChange')[1]);

        expect(mockOnChangePermission).toHaveBeenCalled();
    });

    it('should call onDeleteSchema', () => {
        const mockOnDeleteSchema = jest.fn();
        getRender({
            disableSelectSchema: false,
            onDeleteSchema: mockOnDeleteSchema,
        });
        fireEvent.click(screen.getByTestId('IconButton-onClick'));

        expect(mockOnDeleteSchema).toHaveBeenCalled();
    });

    it('should render call onChangeStates', () => {
        const mockOnChangeStates = jest.fn();
        getRender({
            onChangeStates: mockOnChangeStates,
            workflow: {
                workflowStates: [
                    {
                        id: '1',
                        name: 'State 1',
                    },
                    {
                        id: '2',
                        name: 'State 2',
                    },
                ],
            },
        });
        fireEvent.click(screen.getAllByTestId('StatePicker-onChangeStates')[0], {
            target: { stateId: '1' },
        });
        expect(mockOnChangeStates).toHaveBeenCalled();
    });
});
