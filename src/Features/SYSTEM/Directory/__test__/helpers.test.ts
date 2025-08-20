import { getFormatDirectoriesData } from '../helpers';

describe('getFormatDirectoriesData', () => {
    it('should return empty array', () => {
        const result = getFormatDirectoriesData();
        expect(result).toEqual([]);
    });

    it('should return corect', () => {
        const result = getFormatDirectoriesData([
            {
                id: 1,
                name: 'test 1',
                isSystem: false,
                level: 1,
            },
            {
                id: 1,
                name: 'test 2',
                isSystem: false,
            },
        ]);
        expect(result).toEqual([
            {
                id: 1,
                name: 'test 1',
                isSystem: false,
                level: 1,
            },
            {
                id: 1,
                name: 'test 2',
                isSystem: false,
                level: 0,
            },
        ]);
    });
});
