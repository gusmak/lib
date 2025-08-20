import { getAdvanceSearchValue } from './utils';

describe('getAdvanceSearchValue', () => {
    it('should value is string', () => {
        const result = getAdvanceSearchValue({
            keyA: { value: 'valueA', label: 'Value A' },
            keyB: { value: 'valueB', label: 'Value B' },
        });

        expect(result).toEqual({
            newAdvancedObject: {
                keyA: 'valueA',
                keyB: 'valueB',
            },
            saveAdvancedObject: {
                keyA: {
                    label: 'Value A',
                    value: 'valueA',
                },
                keyB: {
                    label: 'Value B',
                    value: 'valueB',
                },
            },
        });
    });

    it('should value is object', () => {
        const result = getAdvanceSearchValue({
            keyA: { value: { value: 'Value A', lable: 'Label A ' }, label: 'Value A' },
            keyB: { value: 'valueB', label: 'Value B' },
        });

        expect(result).toEqual({
            newAdvancedObject: {
                keyA: 'Value A',
                keyB: 'valueB',
            },
            saveAdvancedObject: {
                keyA: {
                    label: 'Value A',
                    value: {
                        lable: 'Label A ',
                        value: 'Value A',
                    },
                },
                keyB: {
                    label: 'Value B',
                    value: 'valueB',
                },
            },
        });
    });

    it('should value is undefined', () => {
        const result = getAdvanceSearchValue({
            keyC: { value: { value: undefined, lable: undefined }, label: 'Value C' },
            keyD: { value: undefined, label: undefined },
        });

        expect(result).toEqual({
            newAdvancedObject: {
                keyC: undefined,
                keyD: undefined,
            },
            saveAdvancedObject: {
                keyC: {
                    label: 'Value C',
                    value: {
                        lable: undefined,
                        value: undefined,
                    },
                },
            },
        });
    });
});
