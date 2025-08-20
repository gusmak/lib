import { Provider, useAtomValue, useSetAtom } from 'jotai';
import { renderHook, act } from '@testing-library/react';
import { confirmExitState, resetAllState } from '../Atoms';

describe('Recoil Selectors', () => {
    describe('resetStateReconciliation', () => {
        it('should get undefined', () => {
            const { result } = renderHook(() => useAtomValue(resetAllState), {
                wrapper: ({ children }) => <Provider>{children}</Provider>,
            });

            expect(result.current).toEqual(undefined);
        });

        it('should reset all states', () => {
            const { result } = renderHook(
                () => {
                    const resetAllWorkspaceSharing = useSetAtom(resetAllState);
                    const confirmExit = useAtomValue(confirmExitState);
                    return { resetAllWorkspaceSharing, confirmExit };
                },
                {
                    wrapper: Provider,
                }
            );

            act(() => {
                result.current.resetAllWorkspaceSharing();
            });

            expect(result.current.confirmExit).toEqual(false);
        });
    });
});
