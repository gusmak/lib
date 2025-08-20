import { render } from '@testing-library/react';
import { MenuPermission, RouteItem } from '../Types';
import { routerValid, getRouteWorkspacePermission, renderRoutes } from '../utils';
import { BrowserRouter, Routes } from 'react-router';

describe('routerValid', () => {
    it('should return true when router key exists in permissions', () => {
        const router: RouteItem = { key: 'test-key', title: 'Test 1', enabled: true };
        const permissions: MenuPermission[] = [{ key: 'test-key' }];
        expect(routerValid(router, permissions)).toBeTruthy();
    });

    it('should return false when router key does not exist in permissions', () => {
        const router: RouteItem = { key: 'test-key', title: 'Test 1', enabled: true };
        const permissions: MenuPermission[] = [{ key: 'different-key' }];
        expect(routerValid(router, permissions)).toBeFalsy();
    });
});

describe('getRouteWorkspacePermission', () => {
    const mockPermissions: MenuPermission[] = [{ key: 'route1' }, { key: 'subroute1' }, { key: 'subroute2' }];

    const mockRoutes: RouteItem[] = [
        {
            key: 'route1',
            title: 'Route 1',
            path: 'path1',
            enabled: true,
            subRoutes: [
                { key: 'subroute1', path: 'subpath1', title: 'Subroute1', enabled: true },
                { key: 'subroute2', path: 'subpath2', title: 'Subroute2', enabled: true },
                { key: 'subroute3', path: 'subpath3', title: 'Subroute3', enabled: true },
            ],
        },
        {
            key: 'route2',
            title: 'Route 2',
            path: 'path2',
            enabled: false,
            subRoutes: [],
        },
    ];

    it('should filter routes based on permissions', () => {
        const result = getRouteWorkspacePermission(mockRoutes, mockPermissions);
        expect(result.length).toBe(1);
        expect(result[0].key).toBe('route1');
        expect(result[0].subRoutes?.length).toBe(2);
    });

    it('should add workspace prefix when workSpaceId is provided', () => {
        const workSpaceId = 123;
        const result = getRouteWorkspacePermission(mockRoutes, mockPermissions, workSpaceId);
        expect(result[0].path).toBe(`${workSpaceId}/path1`);
        expect(result[0].subRoutes?.[0].path).toBe(`${workSpaceId}/subpath1`);
    });

    it('should handle empty subroutes', () => {
        const emptyRoutes: RouteItem[] = [
            {
                key: 'route1',
                title: 'Route 1',
                enabled: true,
                subRoutes: [],
            },
        ];
        const result = getRouteWorkspacePermission(emptyRoutes, mockPermissions);
        expect(result.length).toBe(0);
    });

    it('should handle disabled routes', () => {
        const disabledRoutes: RouteItem[] = [
            {
                key: 'route1',
                title: 'Route 1',
                enabled: false,
                subRoutes: [{ key: 'subroute1', title: 'Subroute 1', enabled: true }],
            },
        ];
        const result = getRouteWorkspacePermission(disabledRoutes, mockPermissions);
        expect(result.length).toBe(0);
    });
});

describe('renderRoutes', () => {
    const mockPermissions: MenuPermission[] = [{ key: 'route1' }, { key: 'subroute1' }];

    const mockRoutes: RouteItem[] = [
        {
            key: 'route1',
            title: 'Route 1',
            path: 'path1',
            enabled: true,
            element: <div>Route 1</div>,
            subRoutes: [
                {
                    key: 'subroute1',
                    title: 'Subroute 1',
                    path: 'subpath1',
                    enabled: true,
                    element: <div>Subroute 1</div>,
                },
            ],
        },
    ];

    it('should render routes with subroutes', () => {
        const { container } = render(
            <BrowserRouter>
                <Routes>{renderRoutes(mockRoutes, mockPermissions)}</Routes>
            </BrowserRouter>
        );
        expect(container).toBeTruthy();
    });
});
