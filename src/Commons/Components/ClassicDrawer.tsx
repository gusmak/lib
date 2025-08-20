import Drawer, { type ModalDrawerProps } from './Drawer';

const DrawerWrapper = (props: ModalDrawerProps) => {
    return <Drawer {...props} />;
};

export { CloseAction } from './Drawer';
export { type ModalDrawerProps };
export default DrawerWrapper;
