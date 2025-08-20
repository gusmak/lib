import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { schemasState } from '../../Atoms';
import Container, { type OwnProps } from '../PermissionTable';

const initProps: OwnProps = {
    disableSelectSchema: false,
    explicitPermissions: [
        {
            permissions: [],
            schemaId: 1,
            workflowStateIds: [],
        },
        {
            permissions: [],
            schemaId: null,
            workflowStateIds: [],
        },
    ],
    inheritedPermissions: [],
    onChangePermission: jest.fn(),
    onChangeStates: jest.fn(),
    onDeleteSchema: jest.fn(),
};
const getRender = (props?: any) => {
    const initialRecoilState = ({ set }: any) => {
        set(schemasState, []);
    };
    return render(
        <Provider initializeState={initialRecoilState}>
            <Container {...initProps} {...props} />
        </Provider>
    );
};

jest.mock('../SchemaRow', () => ({
    __esModule: true,
    default: () => (
        <div>
            <p data-testid="SchemaRow-header">SchemaRow</p>
        </div>
    ),
}));
// #endregion

describe('render', () => {
    it('should render', () => {
        getRender({
            authenPermissions: [{ authenType: 'USER', authenValue: 1, name: 'demo' }],
        });
        expect(screen.getAllByText('SchemaRow')).toHaveLength(2);
    });
});
