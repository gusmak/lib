import { Directory } from 'Features/SYSTEM/Directory';
import { TreeItemOption } from './interface';

/** Get root item for TreeView */
export const getRootItem = (items: TreeItemOption[]) => {
    if (!items.length) return undefined;

    return items.reduce((res, obj) => {
        if (res.level === undefined || (obj.level && obj.level < res.level)) {
            return obj;
        } else {
            return res;
        }
    }, items[0]);
};

/**
 * Phân tách path, path truyền vào phải đúng định dạng '.path.path.path.'
 * VD: '.12.22.1321.' => ['12', '22', '1321']
 */
export const getSplitPath = (path: string, space = '.') => {
    const result = path.split(space);
    if (result.length < 3 || path.charAt(0) !== space || path.charAt(path.length - 1) !== space) return [];
    result.shift();
    result.pop();

    return result;
};

export const getChildrentByParentPath = (items: TreeItemOption[], parentPath: string) => {
    const parent = getSplitPath(parentPath);
    return items.filter(
        (item) =>
            item.directoryPath &&
            parent.length + 1 === getSplitPath(item.directoryPath).length &&
            item.directoryPath.startsWith(parentPath) &&
            Number(item.parentObjectId) === Number(parent[parent.length - 1])
    );
};

export const sortByDirectoryPath = (data: Directory[]) => {
    // Create a map to store items by their directory path
    const pathMap = new Map<string, Directory>();

    // First pass: store all items in the map
    data.forEach((item: Directory) => {
        if (item.directoryPath) {
            pathMap.set(item.directoryPath, item);
        }
    });

    // Second pass: build the sorted array
    const sortedArray: Directory[] = [];
    const visited = new Set<string>();

    const addItem = (path: string) => {
        if (visited.has(path)) return;
        visited.add(path);

        const item = pathMap.get(path);
        if (!item) return;

        // Add parent first if it exists
        const parentPath = path.split('.').slice(0, -2).join('.') + '.';
        if (parentPath !== '.') {
            addItem(parentPath);
        }

        sortedArray.push(item);
    };

    // Start with all items
    data.forEach((item: Directory) => {
        if (item.directoryPath) {
            addItem(item.directoryPath);
        }
    });

    // Sort the final array based on directoryPath
    return sortedArray.sort((a: Directory, b: Directory) => {
        const aParts = (a.directoryPath || '').split('.').filter(Boolean);
        const bParts = (b.directoryPath || '').split('.').filter(Boolean);

        // Compare each part of the path
        for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
            const aNum = parseInt(aParts[i]);
            const bNum = parseInt(bParts[i]);

            if (aNum !== bNum) {
                return aNum - bNum;
            }
        }

        // If one path is longer, the shorter one comes first
        return aParts.length - bParts.length;
    });
};
