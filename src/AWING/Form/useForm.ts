import { useState, useRef, useEffect, useCallback, type FocusEvent } from 'react';
import { createState } from './Utils';
import set from './Utils/set';
import useMounted from './useMounted';
import compact from './Utils/compact';
import get from './Utils/get';
import convertToArrayPayload from './Utils/convertToArrayPayload';
import cloneProxy from './Utils/cloneProxy';
import { FieldOptions } from './Utils/Types';

export const useForm = (props: { defaultValue: Record<string, any> }) => {
    const { defaultValue } = props;
    const isMount = useMounted();
    const [formState, updateFormState] = useState<{
        errors: string[];
        action: boolean;
        mount: boolean;
        watch: boolean;
    }>({
        errors: [],
        action: false,
        mount: false,
        watch: false,
    });
    const [formValue, updateFormValue] = useState(defaultValue);
    const _formControl = useRef<any>(null);
    const _formError = useRef<string[]>([]);

    useEffect(() => {
        updateFormState((prev) => ({ ...prev, mount: isMount }));
    }, [isMount]);
    const handleWatch = (obj: typeof props.defaultValue, _fullPath: string) => {
        updateFormValue(obj);
    };

    if (!_formControl.current) {
        _formControl.current = createState({
            data: defaultValue,
            watch: handleWatch,
        });
    }
    const _getFieldArray = <T>(name: string): Partial<T>[] => compact(get(formState.mount ? formValue : defaultValue, name, []));
    const _updateFieldArray = (name: string, value: unknown) => {
        set(_formControl.current, name, value);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getValues = useCallback((fieldNames: string | string[]) => {
        const data = convertToArrayPayload(fieldNames).map((fieldName) => cloneProxy(get(_formControl.current, fieldName)));
        if (data.length && data.length > 1) return data;
        if (data.length && data.length === 1) return data[0];
    }, []);
    const register = (fieldPath: string, options?: FieldOptions) => {
        const isRequired = options?.required;
        const onValidate = options?.onValidate;
        return {
            required: isRequired,
            name: fieldPath,
            value: getValues(fieldPath),
            onBlur(_e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) {
                if (isRequired || onValidate) {
                    if (!getValues(fieldPath) || (onValidate && !onValidate(getValues(fieldPath)))) {
                        _formError.current.push(fieldPath);
                    } else {
                        _formError.current = _formError.current.filter((item) => item !== fieldPath);
                    }
                    updateFormState((prev) => ({
                        ...prev,
                        errors: _formError.current,
                    }));
                }
            },
        };
    };
    return {
        formState,
        formValue,
        register,
        watch: () => cloneProxy(_formControl.current),
        getValues,
        control: { _getFieldArray, _updateFieldArray },
        setFormValue: (path: string, value: unknown) => {
            set(_formControl.current, path, value);
        },
    };
};

export default useForm;
