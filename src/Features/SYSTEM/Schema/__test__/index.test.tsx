import { render, screen } from '@testing-library/react';
import Component from '../index';
import { type SchemaServices } from '../Services';

// #region Mock
jest.mock('Utils', () => ({
    AppProvider: () => <div>AppProvider Children</div>,
}));
// #endregion

const mockgetSchemas = jest.fn();
const mockcreateSchema = jest.fn();
const mockdeleteSchema = jest.fn();
const mockgetObjectDefinitions = jest.fn();
const mockgetSchemaById = jest.fn();
const mockupdateSchema = jest.fn();

const services: SchemaServices = {
    getSchemas: mockgetSchemas,
    createSchema: mockcreateSchema,
    deleteSchema: mockdeleteSchema,
    getObjectDefinitions: mockgetObjectDefinitions,
    getSchemaById: mockgetSchemaById,
    updateSchema: mockupdateSchema,
};

describe('render', () => {
    it('should return null', () => {
        render(<Component {...services} />);
        expect(screen.queryByText('AppProvider Children')).not.toBeInTheDocument();
    });

    it('should render', () => {
        render(
            <Component
                {...services}
                currentWorkspace={{
                    id: 10,
                }}
            />
        );

        expect(screen.queryByText('AppProvider Children')).toBeInTheDocument();
    });
});
