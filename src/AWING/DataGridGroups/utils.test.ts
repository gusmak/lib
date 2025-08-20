import { getParentGroupKey } from './utils';

describe('getParentGroupKey', () => {
    // Test case 1: Không có parentGroupKey
    it('should return empty array when filter has no parentGroupKey', () => {
        const result = getParentGroupKey(
            [
                { key: 'name', value: '1' },
                { key: 'age', value: '2' },
            ],
            { key: 'city', value: '3' }
        );
        expect(result).toEqual([]);
    });

    // Test case 2: Có 1 level parent
    it('should return array with one parent when filter has one level parent', () => {
        const result = getParentGroupKey(
            [
                { key: 'name', value: '1' },
                { key: 'age', value: '2' },
            ],
            {
                key: 'city',
                value: '3',
                parentGroupKey: '1',
            }
        );
        expect(result).toEqual([{ key: 'name', value: '1' }]);
    });

    // Test case 3: Có nhiều level parent
    it('should return array with all parents when filter has multiple level parents', () => {
        const result = getParentGroupKey(
            [
                { key: 'name', value: '1' },
                { key: 'age', value: '2', parentGroupKey: '1' },
                { key: 'city', value: '3', parentGroupKey: '2' },
            ],
            {
                key: 'city',
                value: '3',
                parentGroupKey: '2',
            }
        );
        expect(result).toEqual([
            { key: 'age', value: '2', parentGroupKey: '1' },
            { key: 'name', value: '1' },
        ]);
    });

    // Test case 4: Parent không tồn tại trong rootFilters
    it('should return empty array when parent does not exist in rootFilters', () => {
        const result = getParentGroupKey([{ key: 'name', value: '1' }], {
            key: 'city',
            value: '3',
            parentGroupKey: '999', // parent không tồn tại
        });
        expect(result).toEqual([]);
    });

    // Test case 5: Vòng lặp vô hạn (circular reference)
    it('should handle circular references without infinite loop', () => {
        const result = getParentGroupKey(
            [
                { key: 'name', value: '1', parentGroupKey: '3' },
                { key: 'age', value: '2', parentGroupKey: '1' },
                { key: 'city', value: '3', parentGroupKey: '2' },
            ],
            {
                key: 'city',
                value: '3',
                parentGroupKey: '2',
            }
        );
        expect(result.length).toBeLessThan(10); // Đảm bảo không bị vòng lặp vô hạn
    });
});
