import { useLayoutEffect, useRef } from 'react';

const useMounted = () => {
    const mountedRef = useRef(false);
    useLayoutEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);
    return mountedRef.current;
};

export default useMounted;
