import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Autocomplete, Circle, GoogleMap, Libraries, LoadScript, Marker } from '@react-google-maps/api';
import { Box } from '@mui/material';
import { IGoogleMapProps } from './interface';
import { mapStyles } from './utils';

const mapContainerStyle = {
    height: '320px',
    width: '100%',
};

const libraries: Libraries | undefined = ['places'];

const stylesDefault = {
    position: 'relative',
    '& .pac-container.pac-logo': {
        top: '55px!important',
        left: '0!important',
    },
};

const GGMap = ({
    defaultLocation,
    onUpdateLocation,
    apiKey,
    geofenceRadius,
    sxMap,
    isDisplayAutoComplete = false,
    isTypeTracking = false,
    markerPositions,
    zoomCustomed,
}: IGoogleMapProps) => {
    const { t } = useTranslation();
    const [map, setMap] = useState<google.maps.Map>();
    const [_error, setError] = useState<string>('');
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const makerRefs = useRef<Array<google.maps.Circle>>([]);
    const [zoom, setZoom] = useState<number>(zoomCustomed || 5);

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const markerConvert: {
        longitude: number;
        latitude: number;
        count: number;
        radius: number;
    }[] = useMemo(() => {
        const coordMap =
            markerPositions?.reduce((acc: any, { longitude, latitude }) => {
                const key = `${longitude},${latitude}`;

                if (acc[key]) {
                    acc[key].count += 1;
                } else {
                    acc[key] = { longitude, latitude, count: 1 };
                }
                return acc;
            }, {}) ?? {};

        return Object.values(coordMap).map((item: any, _index, arr: Array<any>) => {
            item.radius =
                ((item.count ?? 0) / arr.reduce((acc, item) => acc + (item?.count ?? 0), 0)) * Math.pow(2, 10 - Math.max(zoom, 4)) * 8000;
            return item;
        });
        // Convert the object to an array
    }, [markerPositions, zoom]);

    const onPlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                const newLat = place?.geometry?.location?.lat();
                const newLng = place?.geometry?.location?.lng();
                onUpdateLocation &&
                    onUpdateLocation({
                        latitude: newLat ?? 0,
                        longitude: newLng ?? 0,
                    });
                map?.panTo({ lat: newLat ?? 0, lng: newLng ?? 0 });
                setZoom(18);
            }
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    };

    const onLoadMap = React.useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance);
    }, []);

    //Lấy vị trí hiện tại của người dùng
    const getCurrentLocation = () => {
        const showPosition = (position: GeolocationPosition) => {
            onUpdateLocation &&
                onUpdateLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
        };

        const showError = (error: GeolocationPositionError) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    setError('User denied the request for Geolocation.');
                    break;
                case error.POSITION_UNAVAILABLE:
                    setError('Location information is unavailable.');
                    break;
                case error.TIMEOUT:
                    setError('The request to get user location timed out.');
                    break;
                default:
                    setError('An unknown error occurred.');
                    break;
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    const onMapClick = React.useCallback((e: google.maps.MapMouseEvent) => {
        onUpdateLocation &&
            onUpdateLocation({
                latitude: e?.latLng?.lat() ?? 0,
                longitude: e?.latLng?.lng() ?? 0,
            });
    }, []);

    useEffect(() => {
        if (_.isNil(defaultLocation) || defaultLocation.lat === 0 || defaultLocation.lng === 0) {
            getCurrentLocation();
        }
    }, [defaultLocation]);

    useEffect(() => {
        if (map) {
            makerRefs.current.forEach((marker) => {
                marker.setMap(null);
            });
            makerRefs.current = markerConvert.map((item) => {
                const maker = new google.maps.Circle({
                    center: {
                        lat: item.latitude ?? 0,
                        lng: item.longitude ?? 0,
                    },
                    radius: item.radius,
                    strokeColor: '#4285F4',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#4285F4',
                    fillOpacity: 0.35,
                });
                maker.setMap(map);
                return maker;
            });
        }
    }, [markerConvert]);

    const handleZoom = useCallback((zoom: number) => {
        setZoom(zoom);
    }, []);

    return (
        <Box sx={sxMap ? sxMap : stylesDefault} ref={boxRef}>
            <LoadScript googleMapsApiKey={apiKey || ''} libraries={libraries}>
                {!isDisplayAutoComplete && (
                    <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                        <input
                            type="text"
                            placeholder={t('Common.PlaceHolderLocation')}
                            onFocus={() => {
                                const ggSuggest = document.querySelector('.pac-container.pac-logo')!;
                                if (ggSuggest) {
                                    boxRef.current?.append(ggSuggest);
                                }
                            }}
                            style={{
                                boxSizing: `border-box`,
                                border: `1px solid transparent`,
                                width: `378px`,
                                height: `40px`,
                                padding: `0 12px`,
                                borderRadius: `3px`,
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                fontSize: `14px`,
                                outline: `none`,
                                textOverflow: `ellipses`,
                                position: 'inherit',
                                right: '3%',
                                margin: '10px 0',
                                zIndex: 99,
                                top: '50px',
                            }}
                        />
                    </Autocomplete>
                )}
                {!isTypeTracking ? (
                    <MaprenderWithoutTracking
                        onLoadMap={onLoadMap}
                        onMapClick={onMapClick}
                        onZoomChanged={handleZoom}
                        defaultLocation={
                            defaultLocation ?? {
                                lat: 21.0063107,
                                lng: 105.8279467,
                            }
                        }
                        geofenceRadius={geofenceRadius ?? 0}
                        zoomCustomed={zoomCustomed ?? 10}
                    />
                ) : (
                    <Maprender onLoadMap={onLoadMap} onMapClick={onMapClick} onZoomChanged={handleZoom} />
                )}
            </LoadScript>
        </Box>
    );
};

export default GGMap;

interface IGoogleMapMemoProps {
    onLoadMap(mapInstance: google.maps.Map): void;
    onMapClick(e: google.maps.MapMouseEvent): void;
    onZoomChanged(zoom: number): void;
}

const Maprender = React.memo(({ onLoadMap, onMapClick, onZoomChanged }: IGoogleMapMemoProps) => {
    const mapInstance = useRef<google.maps.Map | null>(null);
    return (
        <GoogleMap
            id="map"
            mapContainerStyle={{ width: '100%', height: `${521}px` }}
            zoom={3}
            center={{
                lat: 21.0063107,
                lng: 105.8279467,
            }}
            onZoomChanged={() => {
                onZoomChanged(mapInstance.current?.getZoom() ?? 0);
            }}
            onLoad={(instance) => {
                mapInstance.current = instance;
                onLoadMap(instance);
            }}
            onClick={onMapClick}
            options={{
                disableDefaultUI: true,
                styles: mapStyles,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                minZoom: 2,
                maxZoom: 13,
            }}
        />
    );
});

interface IMaprenderWithoutTracking extends IGoogleMapMemoProps {
    defaultLocation: { lat: number; lng: number };
    geofenceRadius: number;
    zoomCustomed: number;
}

const MaprenderWithoutTracking = React.memo(
    ({ onLoadMap, onMapClick, onZoomChanged, defaultLocation, geofenceRadius, zoomCustomed }: IMaprenderWithoutTracking) => {
        const mapInstance = useRef<google.maps.Map | null>(null);
        return (
            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={zoomCustomed ?? 10}
                center={defaultLocation}
                onZoomChanged={() => {
                    onZoomChanged(mapInstance.current?.getZoom() ?? 0);
                }}
                onLoad={(instance) => {
                    mapInstance.current = instance;
                    onLoadMap(instance);
                }}
                onClick={onMapClick}
            >
                <Box>
                    <Marker
                        position={
                            defaultLocation ?? {
                                lat: 21.0063107,
                                lng: 105.8279467,
                            }
                        }
                    />
                    <Circle
                        center={defaultLocation}
                        radius={geofenceRadius}
                        options={{
                            fillColor: 'red',
                            fillOpacity: 0.2,
                            strokeColor: 'red',
                            strokeOpacity: 1,
                            strokeWeight: 2,
                        }}
                    />
                </Box>
            </GoogleMap>
        );
    }
);
