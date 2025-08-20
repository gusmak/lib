import { useNavigate } from 'react-router';
import { fireEvent, render, screen } from '@testing-library/react';
import { SchemaContext } from 'Features/SYSTEM/Schema/context';
import { useGetDirectoryContext } from '../../context';
import SchemaProvider, { getPromise } from '../SchemaProvider';

const getRender = (props?: any) => {
    render(<SchemaProvider {...props}>SchemaProvider children</SchemaProvider>);
};

// #region Mock

jest.mock('../../context', () => ({
    ...jest.requireActual('../../context'),
    useGetDirectoryContext: jest.fn(),
}));

// jest.mock('Features/SYSTEM/Schema/context', () => ({
//     SchemaContext: (props: any) => {
//         return (
//             <SchemaContext.Provider>
//                 <p data-testid="SchemaContext-header">SchemaContext</p>
//                 {props?.children}
//             </SchemaContext.Provider>
//         );
//     },
// }));

// #endregion

beforeEach(() => {
    (useGetDirectoryContext as jest.Mock).mockImplementation(() => ({
        services: {
            currentWorkspace: {
                id: 10,
                name: 'ACM',
                defaultSchemas: [],
            },
            createSchema: jest.fn(),
            getSchemaById: jest.fn(),
            getSchemas: jest.fn(),
            getObjectDefinitions: jest.fn(),
        },
    }));
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Render', () => {
    it('should render null', () => {
        (useGetDirectoryContext as jest.Mock).mockImplementation(() => ({}));
        getRender();

        expect(screen.queryByText('SchemaProvider children')).toBeNull();
    });

    it('should render', () => {
        getRender();

        expect(screen.getByText('SchemaProvider children')).toBeInTheDocument();
    });

    it('should return a promise', () => {
        expect(getPromise()).resolves.toBeUndefined();
    });
});
