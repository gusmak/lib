import { renderHook, act } from '@testing-library/react';
import { useAuthenMemoByKey } from '../useAuthens';
import type { Authen } from '../../types';

describe('useAuthens', () => {
    test('should initialize with empty data', () => {
        const { result } = renderHook(() => useAuthenMemoByKey<Authen>());

        expect(result.current[0]).toEqual({ USER: [], ROLE: [], GROUP: [] });
    });

    test('should update users correctly', () => {
        const { result } = renderHook(() => useAuthenMemoByKey());
        const mockUsers: Authen[] = [{ id: 1, name: 'John Doe', type: 'user' }];

        act(() => {
            result.current[1]('USER', mockUsers);
        });

        expect(result.current[0].USER).toEqual(mockUsers);
    });

    test('should update roles correctly', () => {
        const { result } = renderHook(() => useAuthenMemoByKey());
        const mockRoles: Authen[] = [{ id: 2, name: 'Admin', type: 'role' }];

        act(() => {
            result.current[1]('ROLE', mockRoles);
        });

        expect(result.current[0].ROLE).toEqual(mockRoles);
    });

    test('should update groups correctly', () => {
        const { result } = renderHook(() => useAuthenMemoByKey());
        const mockGroups: Authen[] = [{ id: 3, name: 'Developers', type: 'group' }];

        act(() => {
            result.current[1]('GROUP', mockGroups);
        });

        expect(result.current[0].GROUP).toEqual(mockGroups);
    });
});
