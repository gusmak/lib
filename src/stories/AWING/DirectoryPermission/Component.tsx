import { BrowserRouter, Route, Routes } from 'react-router';
import DirectoryPermission, { type DirectoryPermissionServices } from 'AWING/DirectoryPermission';
import { AppProvider } from 'Utils';
import Layout from '../../common/Layout';
import { Provider } from 'jotai';
import { Button, Stack } from '@mui/material';
import { Link } from 'react-router';
import {
    currentWorkspace,
    ObjectTyeCodes,
    objectDefinitions,
    schemas,
    users,
    roles,
    groups,
    directoryBasic,
    directoryHasWorkflowState,
} from './data';
import { toCapitalize } from 'Helpers';

const services: DirectoryPermissionServices = {
    addDirectoryPermission: (_p) => {
        return Promise.resolve();
    },
    deleteDirectoryPermission: (_p) => {
        return Promise.resolve();
    },
    getObjectDefinitions: (_p) => {
        return Promise.resolve({ items: objectDefinitions, total: objectDefinitions.length });
    },
    getDirectoryById: (_p) => {
        return Promise.resolve({});
    },
    getGroups: () => {
        return Promise.resolve({ items: groups, total: groups.length });
    },
    getRoles: () => {
        return Promise.resolve({ items: roles, total: roles.length });
    },
    getUsers: () => {
        return Promise.resolve({ items: users, total: users.length });
    },
    getSchemas: () =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    items: schemas,
                    total: schemas.length,
                });
            }, 600);
        }),
    getSchemaById: (_p) =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 0,
                    name: 'demo schema',
                    isRoot: false,
                    objectTypeCode: 'Campaigns',
                    schemaObjectDefinitions: [],
                });
            }, 600);
        }),

    createSchema: (p) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 600);
        });
    },
};

const Render = () => {
    return (
        <Layout>
            <BrowserRouter>
                <Provider>
                    <AppProvider>
                        <Stack gap={1}>
                            <Button variant="outlined" component={Link} size="small" to={`Permission1/1143`}>
                                Open DirectoryPermission Basic
                            </Button>
                            <Button variant="outlined" component={Link} size="small" to={`Permission2/1145`}>
                                Open DirectoryPermission has workflowStates
                            </Button>
                        </Stack>

                        <Routes>
                            <Route
                                key={'Permission1/:id/*'}
                                path={'Permission1/:id/*'}
                                element={
                                    <DirectoryPermission
                                        currentWorkspace={currentWorkspace}
                                        allObjectTyeCode={Object.keys(ObjectTyeCodes).map((o) => ({
                                            value: toCapitalize(o.split('_').join(' ')).replace(/ /g, ''),
                                            text: toCapitalize(o.split('_').join(' ')),
                                        }))}
                                        services={{
                                            ...services,
                                            getObjectDefinitions: () =>
                                                new Promise((resolve) => {
                                                    setTimeout(() => {
                                                        resolve({
                                                            items: [],
                                                            total: 0,
                                                        });
                                                    }, 1000);
                                                }),
                                            getDirectoryById: () =>
                                                new Promise((resolve) => {
                                                    setTimeout(() => {
                                                        resolve(directoryBasic);
                                                    }, 1000);
                                                }),
                                        }}
                                    />
                                }
                            />
                            <Route
                                key={'Permission2/:id/*'}
                                path={'Permission2/:id/*'}
                                element={
                                    <DirectoryPermission
                                        currentWorkspace={currentWorkspace}
                                        allObjectTyeCode={Object.keys(ObjectTyeCodes).map((o) => ({
                                            value: toCapitalize(o.split('_').join(' ')).replace(/ /g, ''),
                                            text: toCapitalize(o.split('_').join(' ')),
                                        }))}
                                        services={{
                                            ...services,
                                            getObjectDefinitions: () =>
                                                new Promise((resolve) => {
                                                    setTimeout(() => {
                                                        resolve({
                                                            items: objectDefinitions,
                                                            total: 0,
                                                        });
                                                    }, 1000);
                                                }),
                                            getDirectoryById: () =>
                                                new Promise((resolve) => {
                                                    setTimeout(() => {
                                                        resolve(directoryHasWorkflowState as any);
                                                    }, 1000);
                                                }),
                                        }}
                                    />
                                }
                            />
                        </Routes>
                    </AppProvider>
                </Provider>
            </BrowserRouter>
        </Layout>
    );
};

export default Render;
