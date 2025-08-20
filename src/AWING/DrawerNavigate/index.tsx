import DrawerNavigateComponent from './DrawerNavigate';
import { DrawerNavigateProps } from './interface';

export function DrawerNavigate(props: DrawerNavigateProps) {
    return <DrawerNavigateComponent {...props} />;
}

export * from './interface';
export * from './Enum';
export * from './constant';
export default DrawerNavigate;
