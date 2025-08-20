import { useState } from 'react';
import { Routes, Route } from 'react-router';
import { Constants } from '../constants';
import { AppProvider } from 'Utils';
import Container from './Container';
import CreateOrEdit from './CreateOrEdit';
import { RoleTagContext } from './context';
import { RoleTagServices } from './Services';
import type { RoleOptions } from './types';

export type RoleTagSystemProps = RoleTagServices;

export function RoleTagSystem(props: RoleTagSystemProps) {
    const [roleOptions, setRoleOptions] = useState<RoleOptions[]>([]);

    const paths = [
        {
            param: Constants.EDIT_PATH + '/:id',
            element: <CreateOrEdit />,
        },
        {
            param: Constants.CREATE_PATH,
            element: <CreateOrEdit />,
        },
    ];

    return (
        <AppProvider>
            <RoleTagContext.Provider
                value={{
                    services: props,
                    roleOptions,
                    setRoleOptions,
                }}
            >
                <Container />
                <Routes>
                    {paths.map((p) => (
                        <Route key={p.param} path={p.param} element={p.element} />
                    ))}
                </Routes>
            </RoleTagContext.Provider>
        </AppProvider>
    );
}

export * from './types';
export * from './Services';
export default RoleTagSystem;
