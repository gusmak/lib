export function validateGoogleMapLatLong(latlngString: string) {
    let reg = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
    if (reg.test(latlngString)) return true;
    return false;
}

export const formatMarker = (value: string) => {
    if (value && validateGoogleMapLatLong(value)) {
        const [latitude, longitude] = value.split(',').map((x) => parseFloat(x));
        return {
            latitude,
            longitude,
        };
    }
    return null;
};
