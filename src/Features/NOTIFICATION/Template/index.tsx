import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import { Constants } from 'Commons/Constant';
import { TemplateContext } from './context';
import Container from './Container';
import CreateOrEdit from './CreateOrEdit';
import { TemplateServices } from './Services';
import { ObjectTypeCode } from 'Features/types';
import { ObjectDefinition } from './types';
import AppProvider from 'Utils/AppProvider';

export type TemplateProps = {
    services: TemplateServices;
    objectTypeCodes: ObjectTypeCode[];
};

function Template(props: TemplateProps) {
    const [objectDefinitions, setObjectDefinitions] = useState<ObjectDefinition[]>([]);

    useEffect(() => {
        props.services?.getObjectDefinitions().then((res) => {
            setObjectDefinitions(res.items);
        });
    }, []);

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
            <TemplateContext.Provider
                value={{
                    services: props.services,
                    objectTypeCodes: props?.objectTypeCodes,
                    objectDefinitions,
                }}
            >
                <Container />
                <Routes>
                    {paths.map((p) => (
                        <Route key={p.param} path={p.param} element={p.element} />
                    ))}
                </Routes>
            </TemplateContext.Provider>
        </AppProvider>
    );
}

export default Template;
export * from './types';
export * from './Services';
