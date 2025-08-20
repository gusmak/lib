export const formatJSON = (val: any) => {
    try {
        const res = JSON.parse(val);
        return JSON.stringify(res, null, 2);
    } catch {
        const errorJson = {
            error: val,
        };
        return JSON.stringify(errorJson, null, 2);
    }
};
