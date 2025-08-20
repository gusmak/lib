import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type Params<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;

type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never;

type Fetcher<ParamsType extends any[] = any[], ReturnType = any> = (...params: ParamsType) => Promise<ReturnType>;

export const useGetData = <T extends Fetcher>(params: Params<T>, fetcher: T) => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState<UnwrapPromise<ReturnType<T>>>();

    useEffect(() => {
        fetchData(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, params);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = useCallback(
        debounce((params: Params<T>) => {
            setLoading(true);
            fetcher(...params)
                .then((result) => setData(result))
                .finally(() => {
                    setLoading(false);
                });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, 100),
        []
    );

    return { data, isLoading };
};

export default useGetData;
