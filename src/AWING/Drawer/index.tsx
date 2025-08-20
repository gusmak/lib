import { AppProvider } from 'Utils';
import Drawer from './Container';
import { type DrawerProps } from './Types';

const DrawerWrapper = (props: DrawerProps) => {
    return (
        <AppProvider>
            <Drawer {...props} />
        </AppProvider>
    );
};

export default DrawerWrapper;
export * from './Types';
