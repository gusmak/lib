import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PinDrop as ShowMapIcon } from '@mui/icons-material';
import { Box, Grid, IconButton, InputLabel, TextField, Typography } from '@mui/material';
import { MAXIMUM_RADIUS, MIN_RADIUS } from 'Commons/Constant';
import GoogleMap from '../GoogleMap';
import { validateGoogleMapLatLong } from './common';
import { GeoFencingComponentProps } from './interface';

export default function Component(props: GeoFencingComponentProps) {
    const { t } = useTranslation();
    const { label, configs, marker, radius, locationString, onChange, onSearch, onGoongMapSelect, limit, isOnlyMap } = props;
    const [showMap, setShowMap] = useState<boolean>(false);

    return (
        <Box
            style={{
                border: '1px solid lightgray',
                padding: '16px',
                position: 'relative',
            }}
        >
            <InputLabel
                style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '8px',
                    background: 'white',
                    padding: '0px 4px',
                }}
            >
                <Typography variant="body2">{label}</Typography>
            </InputLabel>
            <Grid container>
                {!isOnlyMap && (
                    <>
                        <Grid
                            size={{
                                xs: 6,
                            }}
                            style={{
                                position: 'relative',
                                paddingRight: '8px',
                            }}
                        >
                            <TextField
                                fullWidth
                                label={t('PlaceFilter.Location')}
                                placeholder={t('PlaceFilter.TypeLocation')}
                                variant="outlined"
                                size="small"
                                value={locationString}
                                onChange={(e) => onChange('locationString', e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onSearch();
                                    }
                                }}
                                error={!!(locationString && !validateGoogleMapLatLong(locationString))}
                            />
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMap(!showMap);
                                }}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    bottom: '9px',
                                }}
                                size="small"
                            >
                                <ShowMapIcon />
                            </IconButton>
                        </Grid>
                        <Grid
                            size={{
                                xs: 6,
                            }}
                            style={{ paddingLeft: '8px' }}
                        >
                            <TextField
                                fullWidth
                                label={t('PlaceFilter.Radius')}
                                variant="outlined"
                                size="small"
                                placeholder={t('PlaceFilter.TypeRadius')}
                                type="number"
                                value={radius}
                                onChange={(e) => {
                                    if (!e.target.value.includes('-') && Number(e.target.value) <= (limit?.max || MAXIMUM_RADIUS)) {
                                        onChange('radius', e.target.value);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onSearch();
                                    }
                                }}
                                error={!!(radius && Number(radius) < (limit?.min || MIN_RADIUS))}
                            />
                        </Grid>
                    </>
                )}
                {(isOnlyMap || showMap) && (
                    <Grid
                        size={{
                            xs: 12,
                        }}
                        style={{ position: 'relative', marginTop: '16px' }}
                    >
                        <GoogleMap
                            defaultLocation={{
                                lat: marker?.latitude || 0,
                                lng: marker?.longitude || 0,
                            }}
                            onUpdateLocation={onGoongMapSelect}
                            apiKey={configs.GOOGLE_MAP_KEY}
                            geofenceRadius={radius ? Number(radius) : 0}
                        />
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
