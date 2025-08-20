import { useContext, useMemo } from 'react';
import { createContext } from 'react';
import { SharingProps } from './Types';

export const sharingPropsContext = createContext<SharingProps>({} as any);

const useSharingProps = () => {
    const sharingProps = useContext(sharingPropsContext);
    const props = useMemo(() => {
        return sharingProps;
    }, [sharingProps]);

    return props;
};

export default useSharingProps;
