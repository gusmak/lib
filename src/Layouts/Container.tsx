import { useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { cloneDeep } from 'lodash';
import { useSetAtom } from 'jotai';
import { LayoutContext } from './context';
import { currentWorkspaceState, menuPermissionsState, totalDefaultFavoriteWorkspaceState, workspaceIdsState } from './Atom';
import { renderRoutes } from './utils';
import { LayoutServices } from './Services';
import Dashboard from './Dashboard';
import type { MenuPermission, RouteItem, Workspace } from './Types';

export type ContainerProps = {
    appName: string;
    currentWorkspace: Workspace;
    isShowLayout?: boolean;
    routeList?: RouteItem[];
    menuPermission?: MenuPermission[];
    services?: LayoutServices;
    totalDefaultFavoriteWorkspace?: number;
    workspaceIds?: number[];
};

function Container(props: ContainerProps) {
    const { appName, isShowLayout = true, services } = props;

    /* Atom */
    const setCurrentWorkspace = useSetAtom(currentWorkspaceState);
    const setMenuPermissions = useSetAtom(menuPermissionsState);
    const setTotalDefaultFavoriteWorkspace = useSetAtom(totalDefaultFavoriteWorkspaceState);
    const setWorkspaceIds = useSetAtom(workspaceIdsState);

    /* init menuPermission, currentWorkspace */
    const privateRoutes = useMemo(() => {
        const { routeList = [], menuPermission = [], currentWorkspace } = props;
        setMenuPermissions(menuPermission);
        setCurrentWorkspace(props.currentWorkspace);
        props.totalDefaultFavoriteWorkspace && setTotalDefaultFavoriteWorkspace(props.totalDefaultFavoriteWorkspace);
        props.workspaceIds && setWorkspaceIds(props.workspaceIds);
        /* Trả về route theo permission tương ứng */
        return renderRoutes(cloneDeep(routeList), menuPermission, currentWorkspace.id);
    }, [props.currentWorkspace, props?.menuPermission]);

    return (
        <LayoutContext.Provider
            value={{
                appName,
                services,
                routeList: props.routeList,
            }}
        >
            <BrowserRouter>
                <Routes>
                    {isShowLayout && props.currentWorkspace?.id && (
                        <Route path="/*" element={<Dashboard />}>
                            {privateRoutes}
                        </Route>
                    )}
                </Routes>
            </BrowserRouter>
        </LayoutContext.Provider>
    );
}

export default Container;
