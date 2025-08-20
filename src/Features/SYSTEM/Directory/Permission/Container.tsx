import DirectoryPermission, { DirectoryPermissionServices } from 'AWING/DirectoryPermission';
import { useGetDirectoryContext } from '../context';
import { OBJECT_TYPE_CODE_ALL } from 'AWING/DirectoryPermission/constants';

function Container() {
    const { currentWorkspace, objectTypeCodes, services } = useGetDirectoryContext();

    const directoryPermission: DirectoryPermissionServices | undefined = services
        ? {
              getObjectDefinitions: services?.getObjectDefinitions,
              /* Permission of Directory */
              addDirectoryPermission: services?.addDirectoryPermission,
              deleteDirectoryPermission: services?.deleteDirectoryPermission,
              getDirectoryById: services?.getDirectoryById,
              /* Schema */
              getSchemas: services?.getSchemas,
              getSchemaById: services?.getSchemaById,
              createSchema: services?.createSchema,
              /* Authen */
              getGroups: services?.getGroups,
              getRoles: services?.getRoles,
              getUsers: services?.getUsers,
          }
        : undefined;

    // Add new object type code and create a new array
    const updatedObjectTypeCodes = objectTypeCodes
        ? [{ key: OBJECT_TYPE_CODE_ALL, value: OBJECT_TYPE_CODE_ALL }, ...objectTypeCodes]
        : undefined;

    return (
        <DirectoryPermission
            currentWorkspace={currentWorkspace}
            objectTypeCodes={updatedObjectTypeCodes}
            services={directoryPermission}
        />
    );
}

export default Container;
