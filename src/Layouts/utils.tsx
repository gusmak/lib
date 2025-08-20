import { size } from 'lodash';
import { MenuPermission, RouteItem } from './Types';
import { Route } from 'react-router';
import DefaultComponent from './DefaultComponent';

export const routerValid = (router: RouteItem, permissions: MenuPermission[]) => {
    return permissions.filter((y) => y?.key === router.key).length > 0;
};

export const getRouteWorkspacePermission = (routers: RouteItem[], permissions: MenuPermission[], workSpaceId?: number) => {
    const prefix = workSpaceId ? `${workSpaceId}/` : '';
    const result: RouteItem[] = [];
    routers
        .filter((x) => x.enabled && x.subRoutes?.filter((x) => x.enabled && routerValid(x, permissions)))
        .map((router) => {
            const newSubRouters = router.subRoutes?.filter((x) => x.enabled && routerValid(x, permissions));
            if (size(newSubRouters) > 0) {
                const newRouter: RouteItem = router;

                newRouter.subRoutes = [];
                newRouter.subRoutes = newSubRouters;

                if (newRouter.path) newRouter.path = prefix + newRouter.path;
                newRouter.subRoutes = newRouter.subRoutes?.map((sRoute) => {
                    if (sRoute.path) sRoute.path = prefix + sRoute?.path;
                    return sRoute;
                });

                result.push(newRouter);
            }
            return null;
        });
    return result;
};

export const renderRoutes = (routes: RouteItem[], menusPermission: MenuPermission[], workSpaceId?: number) => {
    return (
        <>
            {getRouteWorkspacePermission(routes, menusPermission, workSpaceId).map(
                (route) =>
                    route !== undefined &&
                    (route.subRoutes ? (
                        route.subRoutes.map((item) => (
                            <Route
                                key={item.key}
                                path={`${item.path}/*`}
                                element={item.element || <DefaultComponent />}
                                index={route.index}
                            />
                        ))
                    ) : (
                        <Route
                            key={route.key}
                            path={`${route.path}/*`}
                            element={route.element || <DefaultComponent />}
                            index={route.index}
                        />
                    ))
            )}
        </>
    );
};
