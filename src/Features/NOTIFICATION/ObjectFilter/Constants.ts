import { ObjectFilterInput } from './types';

export const Constants = {
    CREATE_PATH: 'ObjectFilterCreate',
    EDIT_PATH: 'ObjectFilterEdit',
};

export const defaultObjectFilter: ObjectFilterInput = {
    objectTypeCode: '',
    configType: '',
    name: '',
    logicalExpression: '',
};
