import { Route, Routes } from 'react-router';
import { Constants } from '../constants';
import AddOrEdit from './AddOrEdit';
import Container from './Container';
import { sharingPropsContext as SharingContext } from './Context';
import { SharingProps } from './Types';
import AppProvider from 'Utils/AppProvider';

export function Sharing(props: SharingProps) {
    const paths = [
        {
            param: Constants.CREATE_PATH + Constants.OTHER_PATH,
            element: <AddOrEdit />,
        },
        {
            param: Constants.EDIT_PATH + '/:id' + Constants.OTHER_PATH,
            element: <AddOrEdit />,
        },
    ];
    return (
        <AppProvider>
            <SharingContext.Provider value={props}>
                <Container />
                <Routes>
                    {paths.map((p) => (
                        <Route key={p.param} path={p.param} element={p.element} />
                    ))}
                </Routes>
            </SharingContext.Provider>
        </AppProvider>
    );
}
export * from './Types';
export default Sharing;
