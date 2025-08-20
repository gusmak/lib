import { Constants } from 'Commons/Constant';

export const checkFullControl = (permission?: number) => {
    return permission !== undefined && (permission & Constants.PERMISSION_CODE.FULL_CONTROL) === Constants.PERMISSION_CODE.FULL_CONTROL;
};
