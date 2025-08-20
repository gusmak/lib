import { DirectoryPermissionContext } from './context';
import Container from './Container';
import type { PermissionContainerProps } from './types';

const PermissionWarpper = (props: PermissionContainerProps) => {
    const { currentWorkspace, objectTypeCodes, onCloseDrawer, services } = props;
    return (
        <DirectoryPermissionContext.Provider
            value={{
                currentWorkspace,
                objectTypeCodes,
                services,
                onCloseDrawer,
            }}
        >
            <Container />
        </DirectoryPermissionContext.Provider>
    );
};

export * from './types';
export * from './Services';
export default PermissionWarpper;
