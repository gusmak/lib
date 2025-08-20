import { useState } from 'react';
import type { AuthenType } from '../types';

type AuthenByKeys<T> = {
    [K in AuthenType]: T[];
};

export function useAuthenMemoByKey<T>(initialState?: AuthenByKeys<T>): [AuthenByKeys<T>, (authenType: AuthenType, authens: T[]) => void] {
    const [authens, setAuthens] = useState<AuthenByKeys<T>>(initialState || { User: [], Group: [], Role: [] });

    const setAuthensByType = (authenType: AuthenType, authens: T[]) => {
        setAuthens((prev) => ({
            ...prev,
            [authenType]: authens,
        }));
    };
    return [authens, setAuthensByType];
}
