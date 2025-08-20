import { useState, useRef, useCallback, useMemo } from 'react';
import { cloneDeep } from 'lodash';
import { generateId } from './Utils';
import convertToArrayPayload from './Utils/convertToArrayPayload';
import appendAt from './Utils/append';
import removeArrayAt from './Utils/remove';

export const useFields = (props: any) => {
    const { control, name, keyName = 'id' } = props;
    const [fields, setFields] = useState<any[]>(control._getFieldArray(name));
    const _actioned = useRef(false);
    const ids = useRef<string[]>(control._getFieldArray(name).map(generateId));
    const updateValues = useCallback(
        (updatedFieldArrayValues: any) => {
            _actioned.current = true;
            control._updateFieldArray(name, updatedFieldArrayValues);
        },
        [control, name]
    );
    const append = (value: any | any[], _options?: any) => {
        const appendValue = convertToArrayPayload(cloneDeep(value));
        const updatedFieldArrayValues = appendAt(control._getFieldArray(name), appendValue);

        updateValues(updatedFieldArrayValues);
        setFields(updatedFieldArrayValues);
    };
    const remove = (index?: number | number[]) => {
        const updatedFieldArrayValues: any[] = removeArrayAt(control._getFieldArray(name), index);
        ids.current = removeArrayAt(ids.current, index);
        updateValues(updatedFieldArrayValues);
        setFields(updatedFieldArrayValues);
        control._updateFieldArray(name, updatedFieldArrayValues, removeArrayAt, {
            argA: index,
        });
    };
    return {
        fields: useMemo(
            () =>
                fields.map((field, index) => ({
                    ...field,
                    [keyName]: ids.current[index] || generateId(),
                })) as any[],
            [fields, keyName]
        ),
        remove: useCallback(remove, [updateValues, name, control]),
        append: useCallback(append, [updateValues, name, control]),
    };
};

export default useFields;
