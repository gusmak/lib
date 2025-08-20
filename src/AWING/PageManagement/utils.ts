export const getAdvanceSearchValue = (
    obj: Record<
        string,
        {
            value: unknown;
            label?: string;
        }
    >
) => {
    const keys = Object.keys(obj);
    const saveAdvancedObject = Object.create({});
    const newAdvancedObject = Object.create({});

    keys.forEach((key) => {
        const currentValue = obj[key].value;
        if (typeof currentValue === 'object' && !Array.isArray(currentValue) && currentValue?.hasOwnProperty('value')) {
            /* Check trong trường hợp value của autocomplete */
            const valueObject = currentValue as { value?: unknown; label?: string };
            /* Trả về value trong object value tương ứng */
            newAdvancedObject[key] = valueObject?.value;
            if (typeof valueObject !== 'undefined') saveAdvancedObject[key] = obj[key];
        } else {
            newAdvancedObject[key] = currentValue;
            if (typeof currentValue !== 'undefined') saveAdvancedObject[key] = obj[key];
        }
    });

    return {
        saveAdvancedObject,
        newAdvancedObject,
    };
};
