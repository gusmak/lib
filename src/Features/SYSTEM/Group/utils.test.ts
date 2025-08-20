import { getComparator, stableSort, Order } from './utils';

describe('getComparator', () => {
    test('should return a descending comparator when order is "desc"', () => {
        const comparator = getComparator('desc', 'age');
        const result = comparator({ age: 30 }, { age: 20 });
        expect(result).toBe(-1); // 30 > 20, so it should return -1
    });

    test('should return an ascending comparator when order is "asc"', () => {
        const comparator = getComparator('asc', 'age');
        const result = comparator({ age: 30 }, { age: 20 });
        expect(result).toBe(1); // 30 > 20, so it should return 1
    });

    test('should return 0 when values are equal', () => {
        const comparator = getComparator('asc', 'age');
        const result = comparator({ age: 20 }, { age: 20 });
        expect(result).toBe(-0);
    });
});

describe('stableSort', () => {
    const data = [
        { id: 1, age: 30 },
        { id: 2, age: 20 },
        { id: 3, age: 30 },
    ];

    test('should sort by age in ascending order', () => {
        const comparator = getComparator('asc', 'age');
        const sorted = stableSort(data, comparator);
        expect(sorted).toEqual([
            { id: 2, age: 20 },
            { id: 1, age: 30 },
            { id: 3, age: 30 },
        ]);
    });

    test('should sort by age in descending order', () => {
        const comparator = getComparator('desc', 'age');
        const sorted = stableSort(data, comparator);
        expect(sorted).toEqual([
            { id: 1, age: 30 },
            { id: 3, age: 30 },
            { id: 2, age: 20 },
        ]);
    });

    test('should preserve stable order for items with equal values', () => {
        const comparator = getComparator('asc', 'age');
        const sorted = stableSort(data, comparator);
        expect(sorted[0].id).toBe(2); // Item with id 2 should still come first
    });
});
