import { Constants } from 'Commons/Constant';
import CreateOrEdit from './CreateOrEdit';
import Container from './container';
import { Route, Routes } from 'react-router';
import { NotificationConfigContext } from './context';
import { NotificationConfigServices } from './Services';
import AppProvider from 'Utils/AppProvider';
import { ObjectTypeCode } from 'Features/types';

export type NotificationConfigProps = NotificationConfigServices & {
    objectTypeCodes: ObjectTypeCode[];
    sagaTransactionType: ObjectTypeCode[];
};
export default function NotificationConfig(props: NotificationConfigProps) {
    const { objectTypeCodes, sagaTransactionType, ...services } = props;

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
            <NotificationConfigContext.Provider
                value={{
                    services: services,
                    objectTypeCodes: objectTypeCodes,
                    sagaTransactionType: sagaTransactionType,
                }}
            >
                <Container />
                <Routes>
                    {paths.map((p) => (
                        <Route key={p.param} path={`${p.param}/*`} element={p.element} />
                    ))}
                </Routes>
            </NotificationConfigContext.Provider>
        </AppProvider>
    );
}

export * from './types';
export * from './Services';
