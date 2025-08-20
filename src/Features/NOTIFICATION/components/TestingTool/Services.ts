import type { TestingInput } from './types';

export type TestingToolServices = {
    /** Get by Id */
    getObjectJsonById: (p: { variables: { objectType: string; id: number } }) => Promise<{
        testGetObjectJsonById: { status: boolean; message: string };
    }>;

    testNotification: (p: { variables: { input: TestingInput } }) => Promise<{
        testNotification: { status: boolean; message: string };
    }>;
};
