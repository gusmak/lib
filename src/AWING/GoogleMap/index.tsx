import GGMap from './GGMap';
import { IGoogleMapProps } from './interface';

export function GoogleMap(props: IGoogleMapProps) {
    return <GGMap {...props} />;
}

export default GoogleMap;
export * from './interface';
