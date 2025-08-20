import { FC, createElement as _c, type ComponentProps, type ReactElement } from 'react';
const Wrapper = <T extends FC<any> = () => ReactElement, W extends FC<any> = () => ReactElement>(
    Compoent: T,
    Parrent: {
        component: W;
        props?: ComponentProps<W>;
    }
) => {
    const wrapped: FC<ComponentProps<T>> = (props) => {
        return _c(Parrent.component, Parrent.props, _c(Compoent, props));
    };
    return wrapped;
};

export default Wrapper;
