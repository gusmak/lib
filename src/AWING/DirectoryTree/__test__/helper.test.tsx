import { getRootItem, getSplitPath, getChildrentByParentPath } from '../helper';

describe('getRootItem', () => {
    it('should return undefined', () => {
        const rootItem = getRootItem([]);

        expect(rootItem).toEqual(undefined);
    });

    it('should return root item', () => {
        const rootItem = getRootItem([
            {
                text: 'text 0',
                value: 'value 0',
            },
            {
                text: 'text 1',
                value: 'value 1',
                level: 1,
            },
            {
                text: 'text 2',
                value: 'value 2',
                level: 2,
            },
        ]);

        expect(rootItem).toEqual({
            text: 'text 1',
            value: 'value 1',
            level: 1,
        });
    });

    it('should return root item', () => {
        const rootItem = getRootItem([
            {
                text: 'text 0',
                value: 'value 0',
                level: 0,
            },
            {
                text: 'value 1',
                value: 'value 1',
                level: 1,
            },
            {
                text: 'value 2',
                value: 'value 2',
                level: 1,
            },
        ]);

        expect(rootItem).toEqual({
            text: 'text 0',
            value: 'value 0',
            level: 0,
        });
    });
});

describe('getSplitPath', () => {
    it('should return empty array', () => {
        const path1 = getSplitPath('');
        const path2 = getSplitPath('12.22.1321.');
        const path3 = getSplitPath('.12.22.1321');

        expect(path1).toEqual([]);
        expect(path2).toEqual([]);
        expect(path3).toEqual([]);
    });

    it('should return array of string', () => {
        const path = getSplitPath('.12.22.1321.');

        expect(path).toEqual(['12', '22', '1321']);
    });
});

describe('getChildrentByParentPath', () => {
    it('should return empty array', () => {
        const childs = getChildrentByParentPath([], '');

        expect(childs).toEqual([]);
    });

    it('should return empty array', () => {
        const childs = getChildrentByParentPath([], '.100.');

        expect(childs).toEqual([]);
    });

    it('should return array of children', () => {
        const childs = getChildrentByParentPath(
            [
                {
                    text: 'ABC',
                    value: 1,
                    objectId: 10,
                    parentObjectId: 0,
                    directoryPath: '.0.10.',
                },
                {
                    text: 'text 1',
                    value: 21,
                    objectId: 11,
                    parentObjectId: 10,
                    directoryPath: '.0.10.11.',
                },
                {
                    text: 'text 2',
                    value: 22,
                    objectId: 22,
                    parentObjectId: 10,
                    directoryPath: '.0.10.22.',
                },
                {
                    text: 'text 3',
                    value: 23,
                    objectId: 22,
                    parentObjectId: 10,
                    directoryPath: '.0.10.22.22',
                },
            ],
            '.0.10.'
        );

        expect(childs).toEqual([
            {
                text: 'text 1',
                value: 21,
                objectId: 11,
                parentObjectId: 10,
                directoryPath: '.0.10.11.',
            },
            {
                text: 'text 2',
                value: 22,
                objectId: 22,
                parentObjectId: 10,
                directoryPath: '.0.10.22.',
            },
        ]);
    });

    it('should return array of children', () => {
        const childs = getChildrentByParentPath(
            [
                {
                    text: 'ABC',
                    value: 1,
                    objectId: 10,
                    parentObjectId: 0,
                    directoryPath: '.0.10.',
                },
                {
                    text: 'text 1',
                    value: 21,
                    objectId: 11,
                    parentObjectId: 10,
                    directoryPath: '.0.10.11.',
                },
                {
                    text: 'text 2',
                    value: 22,
                    objectId: 22,
                    parentObjectId: 10,
                    directoryPath: '.0.10.22.',
                },
                {
                    text: 'text 3',
                    value: 23,
                    objectId: 22,
                    parentObjectId: 22,
                    directoryPath: '.0.10.22.22.',
                },
            ],
            '.0.10.22.'
        );

        expect(childs).toEqual([
            {
                text: 'text 3',
                value: 23,
                objectId: 22,
                parentObjectId: 22,
                directoryPath: '.0.10.22.22.',
            },
        ]);
    });
});
