import stringToPath from './stringToPath';

const isKey = (value: string) => /^\w*$/.test(value);

function setValueByStringKey(obj: Record<string, any>, path: string, value: unknown) {
    const keys = isKey(path) ? [path] : stringToPath(path);
    let currentObj = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        currentObj = currentObj[keys[i]];
        if (currentObj === undefined) return;
    }
    currentObj[keys[keys.length - 1]] = value;
}
export default setValueByStringKey;
