import { Route, Routes } from 'react-router';
import { AppProvider } from 'Utils';
import { Constants } from './Constants';
import { ObjectFilterContext } from './context';
import { ObjectFilterServices } from './Services';
import Container from './Container';
import CreateOrEdit from './CreateOrEdit';
import { EnumTypeConvert } from 'Features/types';
import { LogicExpressionsStructure } from './types';

const NotificationFilter = (
    props: ObjectFilterServices & {
        objectTyeCodes: EnumTypeConvert[];
        objectConfigTypes: EnumTypeConvert[];
        logicExpressionsStructure: LogicExpressionsStructure;
    }
) => {
    const { objectTyeCodes, logicExpressionsStructure, objectConfigTypes, ...services } = props;

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
            <ObjectFilterContext.Provider
                value={{
                    services: services,
                    objectTyeCodes,
                    objectConfigTypes,
                    logicExpressionsStructure,
                }}
            >
                <Container />
                <Routes>
                    {paths.map((p) => (
                        <Route key={p.param} path={p.param} element={p.element} />
                    ))}
                </Routes>
            </ObjectFilterContext.Provider>
        </AppProvider>
    );
};

export * from './types';
export * from './Services';
export default NotificationFilter;
