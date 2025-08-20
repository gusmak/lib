import GeoFencingComponent from './container';
import { GeoFencingProps } from './interface';

export function GeoFencing(props: GeoFencingProps) {
    return <GeoFencingComponent {...props} />;
}

export default GeoFencing;
export * from './interface';
