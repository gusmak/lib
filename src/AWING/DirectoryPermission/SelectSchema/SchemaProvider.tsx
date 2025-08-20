import { SchemaContext } from 'Features/SYSTEM/Schema/context';
import { useGetDirectoryContext } from '../context';

export const getPromise = () => Promise.resolve();

function SchemaProvider(props: { children: React.ReactNode }) {
    const { services, currentWorkspace } = useGetDirectoryContext();

    return services ? (
        <SchemaContext.Provider
            value={{
                currentWorkspace,
                services: {
                    createSchema: services.createSchema,
                    getSchemaById: services.getSchemaById,
                    getSchemas: services.getSchemas,
                    getObjectDefinitions: services.getObjectDefinitions,
                    // don't need to implement these functions
                    updateSchema: getPromise,
                    deleteSchema: getPromise,
                },
            }}
        >
            {props.children}
        </SchemaContext.Provider>
    ) : null;
}

export default SchemaProvider;
