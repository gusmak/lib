import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { DEFAULT_RADIUS, MIN_RADIUS } from 'Commons/Constant';
import { TIME_PICK_ON_MAP_DELAY } from 'Commons/Constant';
import Component from './component';
import { GeoFencingProps } from './interface';
import { formatMarker } from './common';

const pickOnMapDelay = debounce((action: () => void) => {
    action();
}, TIME_PICK_ON_MAP_DELAY);

const onSearchDelay = debounce((action: () => void) => {
    action();
}, TIME_PICK_ON_MAP_DELAY);

export default function Container(props: GeoFencingProps) {
    const { configs, onChangeValue, label, initValue, value, limit, isOnlyMap } = props;
    const [marker, setMarker] = useState<{
        latitude: number;
        longitude: number;
    } | null>({
        latitude: initValue?.latitude || 0,
        longitude: initValue?.longitude || 0,
    });
    const [radius, setRadius] = useState<string>(initValue?.radius?.toString() || DEFAULT_RADIUS);
    const [locationString, setLocationString] = useState<string>(
        initValue?.latitude && initValue?.longitude ? `${initValue.latitude}, ${initValue.longitude}` : ''
    );

    useEffect(() => {
        setMarker(formatMarker(locationString));
    }, [locationString]);

    useEffect(() => {
        onSearchDelay(() => {
            if (marker && radius) {
                if (Number(radius) >= (limit?.min || MIN_RADIUS)) {
                    onChangeValue({ ...marker, radius: Number(radius) });
                }
            } else {
                if (!locationString || !radius) {
                    onChangeValue(undefined);
                }
            }
        });
    }, [marker, radius]);

    useEffect(() => {
        if (value) {
            if (`${value.latitude}, ${value.longitude}` !== locationString) {
                setLocationString(`${value.latitude}, ${value.longitude}`);
            }
            if (value?.radius?.toString() !== radius) {
                setRadius(value?.radius?.toString() || DEFAULT_RADIUS);
            }
        } else {
            if (!initValue) {
                setLocationString('');
                setRadius(DEFAULT_RADIUS);
            }
        }
    }, [value]);

    const handleChange = (type: string, newValue: number | string) => {
        if (type === 'locationString') {
            setLocationString(newValue.toString());
        } else {
            setRadius(newValue.toString());
        }
    };

    const handleSearch = () => {
        onSearchDelay.cancel();
        if (marker && radius) {
            if (Number(radius) >= (limit?.min || MIN_RADIUS)) {
                onChangeValue({ ...marker, radius: Number(radius) });
            }
        } else {
            if (!locationString || !radius) {
                onChangeValue(undefined);
            }
        }
    };

    const handleGoongMapSelect = (newValue: { latitude: number; longitude: number }) => {
        setLocationString(`${newValue.latitude}, ${newValue.longitude}`);
        if (radius) {
            pickOnMapDelay(() => onChangeValue({ ...newValue, radius: Number(radius) }));
        }
    };

    return (
        <Component
            label={label}
            configs={configs}
            marker={marker}
            radius={radius}
            locationString={locationString}
            onChange={handleChange}
            onSearch={handleSearch}
            onGoongMapSelect={handleGoongMapSelect}
            limit={limit}
            isOnlyMap={isOnlyMap}
        />
    );
}
