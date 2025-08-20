import { useState } from 'react';
import { Routes, Route } from 'react-router';
import { AppProvider } from 'Utils';
import { Constants } from '../constants';
import Container from './Container';
import CreateOrEdit from './CreateOrEdit';
import { RoleContext } from './context';
import { RoleServices } from './Services';
import type { RoleTagOptions } from './types';

export type RoleSystemProps = RoleServices;

export function RoleSystem(props: RoleSystemProps) {
    const [roleTagOptions, setRoleTagOptions] = useState<RoleTagOptions[]>([]);

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
            <RoleContext.Provider
                value={{
                    services: props,
                    roleTagOptions,
                    setRoleTagOptions,
                }}
            >
                <Container />
                <Routes>
                    {paths.map((p) => (
                        <Route key={p.param} path={p.param} element={p.element} />
                    ))}
                </Routes>
            </RoleContext.Provider>
        </AppProvider>
    );
}

export * from './types';
export * from './Services';
export default RoleSystem;
