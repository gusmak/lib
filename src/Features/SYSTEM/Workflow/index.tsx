import Container from './container';
import CreateOrEdit from './CreateOrEdit';
import { Constants } from '../constants';
import { Routes, Route } from 'react-router';
import { Workflow } from './types';
import { ObjectInputType, PagingQueryInput, PagingType } from 'Features/types';
import AppProvider from 'Utils/AppProvider';

type WorkflowFeatureProps = {
    getById: (id: number) => Promise<Workflow>;
    getPaging: (queryInput: PagingQueryInput<Workflow>) => Promise<PagingType<Workflow>>;
    create: (workflow: ObjectInputType<Workflow>) => Promise<void>;
    update: (id: number, workflow: ObjectInputType<Workflow>) => Promise<void>;
    remove: (id: number) => Promise<void>;
    objectTypeCodeMap: { value: string; label: string }[];
};

export default function WorkflowFeature(props: WorkflowFeatureProps) {
    const { getPaging, remove, ...other } = props;

    const paths = [
        {
            param: Constants.CREATE_PATH,
            element: <CreateOrEdit {...other} />,
        },
        {
            param: Constants.EDIT_PATH + '/:id',
            element: <CreateOrEdit {...other} />,
        },
    ];

    return (
        <AppProvider>
            <Container getPaging={getPaging} remove={remove} />
            <Routes>
                {paths.map((p) => (
                    <Route key={p.param} path={`${p.param}/*`} element={p.element} />
                ))}
            </Routes>
        </AppProvider>
    );
}
export * from './types';
