import { getRoutePath } from 'Helpers/api';
import { useLocation, useParams } from 'react-router';

const usePath = () => {
    const location = useLocation();
    const params = useParams();
    const path = getRoutePath(location, params);
    return path;
};

export default usePath;
