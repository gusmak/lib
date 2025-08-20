import Container from './container';
import Create from './Create';
import Edit from './Edit';
import { useState } from 'react';
import { RoleTagOptions } from '../Role';
import { Constants } from '../constants';
import { Route, Routes } from 'react-router';
import { GroupContext } from './context';
import { GroupServices } from './Services';
import AppProvider from 'Utils/AppProvider';

export type GroupSystemProps = GroupServices;

export default function GroupSystem(props: GroupSystemProps) {
    const [roleTagOptions, setRoleTagOptions] = useState<RoleTagOptions[]>([]);

    const paths = [
        {
            param: Constants.CREATE_PATH,
            element: <Create />,
        },
        {
            param: Constants.EDIT_PATH + '/:id',
            element: <Edit />,
        },
    ];

    return (
        <AppProvider>
            <GroupContext.Provider
                value={{
                    services: props,
                    roleTagOptions,
                    setRoleTagOptions,
                }}
            >
                <Container />
                <Routes>
                    {paths.map((p) => (
                        <Route key={p.param} path={`${p.param}/*`} element={p.element} />
                    ))}
                </Routes>
            </GroupContext.Provider>
        </AppProvider>
    );
}
