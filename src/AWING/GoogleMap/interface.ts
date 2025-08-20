export interface IGoogleMapProps {
    defaultLocation?: {
        lat: number;
        lng: number;
    };
    onUpdateLocation?: (newValue: { latitude: number; longitude: number }) => void;
    apiKey: string;
    geofenceRadius?: number;
    sxMap?: any;
    isDisplayAutoComplete?: boolean;
    isTypeTracking?: boolean;
    markerPositions?: {
        longitude: number | null;
        latitude: number | null;
    }[];
    zoomCustomed?: number;
}
