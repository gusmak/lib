import Edit from './Edit';
import Container from './container';
import AddExistedUser from './AddExisted';
import { Constants } from 'Commons/Constant';
import { Route, Routes } from 'react-router';
import { UserContext } from './context';
import { UserServices } from './Services';
import { useState } from 'react';
import { RoleTagOptions } from './types';
import AppProvider from 'Utils/AppProvider';

export type UserSystemProps = UserServices;

export default function User(props: UserSystemProps) {
    const [roleTagOptions, setRoleTagOptions] = useState<RoleTagOptions[]>([]);
    const [groupsTagOptions, setGroupsTagOptions] = useState<RoleTagOptions[]>([]);

    const paths = [
        {
            param: Constants.EDIT_PATH + '/:id',
            element: <Edit />,
        },
        {
            param: Constants.ADD_EXISTED_USER,
            element: <AddExistedUser />,
        },
    ];

    return (
        <AppProvider>
            <UserContext.Provider
                value={{
                    services: props,
                    roleTagOptions,
                    setRoleTagOptions,
                    groupsTagOptions,
                    setGroupsTagOptions,
                }}
            >
                <Container />
                <Routes>
                    {paths.map((p) => (
                        <Route key={p.param} path={p.param} element={p.element} />
                    ))}
                </Routes>
            </UserContext.Provider>
        </AppProvider>
    );
}
