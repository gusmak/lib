import { MemoryRouter, useNavigate } from 'react-router';
import { Provider } from 'jotai';
import { fireEvent, render, screen } from '@testing-library/react';
import { useGetDirectoryContext } from '../../context';
import { fullFieldsState, rootSchemasState, schemasState } from '../../Atoms';
import Container from '../Container';
import type { SelectSchemaProps } from '../types';

const initProps: SelectSchemaProps = {
    explicitPermissions: [],
    drawerLevel: 2,
    onExplicitPermissionsChange: jest.fn(),
    onDrawerLevelChange: jest.fn(),
};

const getRender = (props?: Partial<SelectSchemaProps>) => {
    const initialRecoilState = ({ set }: any) => {
        set(fullFieldsState, [
            {
                id: 2,
                objectTypeCode: 'Campaigns',
            },
        ]);
        set(rootSchemasState, [
            {
                id: 1,
                name: 'schema',
                objectTypeCode: 'Campaigns',
            },
        ]);
        set(schemasState, [
            {
                id: 1,
                name: 'demo schema',
                objectTypeCode: 'Campaigns',
            },
            {
                id: 2,
                name: 'demo schema 02',
                objectTypeCode: 'Campaigns',
            },
            {
                id: 3,
                name: 'demo schema 03',
                objectTypeCode: 'Campaigns',
            },
        ]);
    };
    render(
        <Provider initializeState={initialRecoilState}>
            <MemoryRouter initialEntries={['/CreateSchema']}>
                <Container {...initProps} {...props} />
            </MemoryRouter>
        </Provider>
    );
};

// #region Mock

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
    Link: (props: any) => <a onClick={props?.onClick}>{props?.children}</a>,
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Button: (props: any) => <button data-testid="Button-onClick" onClick={props?.onClick} />,
}));

jest.mock('../../context', () => ({
    ...jest.requireActual('../../context'),
    useGetDirectoryContext: jest.fn(),
}));

jest.mock('Commons/Components', () => ({
    ClassicDrawer: (props: any) => {
        return (
            <div>
                <p data-testid="ClassicDrawer-header">ClassicDrawer</p>
                <button data-testid="ClassicDrawer-onClose" onClick={props.onClose} />
                <button data-testid="ClassicDrawer-onSubmit" onClick={props.onSubmit} />
                {props?.children}
            </div>
        );
    },
}));

jest.mock('../SchemaProvider', () => ({
    __esModule: true,
    default: (props: any) => {
        return <div>{props?.children}</div>;
    },
}));

jest.mock('../SchemaView', () => ({
    __esModule: true,
    default: (props: any) => {
        return (
            <div>
                <p data-testid="SchemaView-header">SchemaView</p>
                <p data-testid={`SchemaView-selectedSchemaIds-${props?.id}`}>{props?.selectedSchemaIds.map((id: any) => id + ',')}</p>
                <button
                    data-testid={`SchemaView-onOpenEditSchema-${props?.id}`}
                    onClick={(e: any) => props.onOpenEditSchema(e.target.schema)}
                />
                <button
                    data-testid={`SchemaView-onSelectedSchemaChange-${props?.id}`}
                    onClick={(e: any) => props.onSelectedSchemaChange(e.target.checked, e.target.schema)}
                />
            </div>
        );
    },
}));

jest.mock('Features/SYSTEM/Schema/AddOrEdit', () => ({
    __esModule: true,
    default: (props: any) => {
        return (
            <div>
                <button data-testid={`AddOrEdit-onUpdateSchemas`} onClick={props.onUpdateSchemas()} />
            </div>
        );
    },
}));
// #endregion

const mockNavigate = jest.fn();
beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useGetDirectoryContext as jest.Mock).mockImplementation(() => ({
        services: {
            currentWorkspace: {
                id: 10,
                name: 'ACM',
                defaultSchemas: [],
            },
            getSchemas: jest.fn(() =>
                Promise.resolve({
                    items: [],
                    total: 0,
                })
            ),
        },
    }));
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Render', () => {
    it('should render', () => {
        getRender();

        expect(screen.getByTestId('ClassicDrawer-header')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should called ClassicDrawer onClose', () => {
        const mockOnDrawerLevelChange = jest.fn();
        getRender({
            drawerLevel: 4,
            onDrawerLevelChange: mockOnDrawerLevelChange,
        });

        fireEvent.click(screen.getByTestId('ClassicDrawer-onClose'));
        expect(mockOnDrawerLevelChange).toHaveBeenCalledWith(3);
    });

    it('should called onSelectedSchemaChange with default', () => {
        const mockOnDrawerLevelChange = jest.fn();
        getRender({
            drawerLevel: 4,
            onDrawerLevelChange: mockOnDrawerLevelChange,
        });

        fireEvent.click(screen.getByTestId('SchemaView-onSelectedSchemaChange-SchemaView_default'), {
            target: {
                checked: true,
                schema: {
                    id: 1,
                    name: 'schema',
                    objectTypeCode: 'Campaigns',
                },
            },
        });
        expect(screen.getByTestId('SchemaView-selectedSchemaIds-SchemaView_default')).toHaveTextContent('1,');
    });

    it('should called onSelectedSchemaChange with default', () => {
        const mockOnDrawerLevelChange = jest.fn();
        getRender({
            drawerLevel: 4,
            onDrawerLevelChange: mockOnDrawerLevelChange,
        });

        fireEvent.click(screen.getByTestId('SchemaView-onSelectedSchemaChange-SchemaView_2'), {
            target: {
                checked: true,
                schema: {
                    id: 2,
                    name: 'demo schema 02',
                    objectTypeCode: 'Campaigns',
                },
            },
        });
        fireEvent.click(screen.getByTestId('SchemaView-onSelectedSchemaChange-SchemaView_2'), {
            target: {
                checked: false,
                schema: {
                    id: 2,
                    name: 'demo schema 02',
                    objectTypeCode: 'Campaigns',
                },
            },
        });
        expect(screen.getByTestId('SchemaView-selectedSchemaIds-SchemaView_2')).toBeInTheDocument();
    });

    it('should call SchemaView onOpenEditSchema', () => {
        const mockOnDrawerLevelChange = jest.fn();
        getRender({
            drawerLevel: 4,
            onDrawerLevelChange: mockOnDrawerLevelChange,
        });

        fireEvent.click(screen.getByTestId('SchemaView-onOpenEditSchema-SchemaView_2'), {
            target: {
                schema: {
                    id: 2,
                    name: 'demo schema 02',
                    objectTypeCode: 'Campaigns',
                },
            },
        });
        expect(mockOnDrawerLevelChange).toHaveBeenCalled();
    });

    it('should call update schema', () => {
        const mockGetSchemas = jest.fn(() =>
            Promise.resolve({
                items: [],
                total: 0,
            })
        );
        (useGetDirectoryContext as jest.Mock).mockImplementation(() => ({
            services: {
                currentWorkspace: {
                    id: 10,
                    name: 'ACM',
                    defaultSchemas: [],
                },
                getSchemas: mockGetSchemas,
            },
        }));
        getRender();

        fireEvent.click(screen.getByTestId('AddOrEdit-onUpdateSchemas'));
        expect(mockGetSchemas).toHaveBeenCalled();
    });

    it('should call Button onClick', () => {
        const mockOnDrawerLevelChange = jest.fn();
        getRender({
            drawerLevel: 4,
            onDrawerLevelChange: mockOnDrawerLevelChange,
        });

        fireEvent.click(screen.getByTestId('Button-onClick'));
        expect(mockOnDrawerLevelChange).toHaveBeenCalled();
    });

    it('should call ClassicDrawer onSubmit', () => {
        const mockOnExplicitPermissionsChange = jest.fn();
        getRender({
            onExplicitPermissionsChange: mockOnExplicitPermissionsChange,
        });

        fireEvent.click(screen.getByTestId('ClassicDrawer-onSubmit'));
        expect(mockOnExplicitPermissionsChange).toHaveBeenCalled();
    });
});
