export interface IConfig {
    GOOGLE_MAP_KEY: string;
}

export interface GeoFencingValue {
    latitude?: number;
    longitude?: number;
    radius?: number;
}

export interface GeoFencingProps {
    initValue?: GeoFencingValue;
    onChangeValue: (value: GeoFencingValue | undefined) => void;
    label: string;
    configs: IConfig;
    value?: GeoFencingValue;
    limit?: { min?: number; max?: number };
    isOnlyMap?: boolean;
}

export interface GeoFencingComponentProps extends Omit<GeoFencingProps, 'onChangeValue'> {
    marker: { latitude: number; longitude: number } | null;
    radius: string;
    locationString: string;
    onGoongMapSelect: (newValue: { latitude: number; longitude: number }) => void;
    onChange: (type: string, newValue: number | string) => void;
    onSearch: () => void;
}
