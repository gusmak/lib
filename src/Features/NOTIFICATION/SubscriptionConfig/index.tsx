import { Constants } from 'Commons/Constant';
import Container from './container';
import CreateOrEdit from './CreateOrEdit';
import { Route, Routes } from 'react-router';
import { SubscriptionConfigServices } from './Services';
import AppProvider from 'Utils/AppProvider';
import { SubscriptionConfigContext } from './context';
import { ObjectTypeCode } from 'Features/types';
export default function SubscriptionConfig(props: { services: SubscriptionConfigServices; objectTypeCodes: ObjectTypeCode[] }) {
    const paths = [
        {
            param: Constants.CREATE_PATH,
            element: <CreateOrEdit />,
        },
        {
            param: Constants.EDIT_PATH + '/:id',
            element: <CreateOrEdit />,
        },
    ];
    return (
        <AppProvider>
            <SubscriptionConfigContext.Provider
                value={{
                    services: props.services,
                    objectTypeCodes: props.objectTypeCodes,
                }}
            >
                <Container />
                <Routes>
                    {paths.map((p) => (
                        <Route key={p.param} path={`${p.param}/*`} element={p.element} />
                    ))}
                </Routes>
            </SubscriptionConfigContext.Provider>
        </AppProvider>
    );
}

export * from './types';
export * from './Services';
