import { AppProvider } from 'Utils';
import { ToolbarContext } from './context';
import Container from './Container';
import { type ToolbarServices } from './Services';
import type { Workspace } from './Types';

export type ToolbarLayoutProps = ToolbarServices & {
    currentWorkspace?: Workspace;
    totalDefaultFavoriteWorkspace?: number;
    workspaceIds?: number[];
};

const ToolbarLayout = (props: ToolbarLayoutProps) => {
    const { currentWorkspace, totalDefaultFavoriteWorkspace, workspaceIds, ...services } = props;

    return (
        <AppProvider>
            <ToolbarContext.Provider
                value={{
                    currentWorkspace,
                    services,
                }}
            >
                <Container totalDefaultFavoriteWorkspace={totalDefaultFavoriteWorkspace} workspaceIds={workspaceIds} />
            </ToolbarContext.Provider>
        </AppProvider>
    );
};

export * from './Services';
export default ToolbarLayout;
