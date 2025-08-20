import { getTableHeader } from '../getTableHeader';

describe('getTableHeader', () => {
    it('should return cells when t is valid', () => {
        const t = jest.fn();
        const result = getTableHeader(t as any);
        expect(result).toEqual([
            { id: 'stt', numeric: false, disablePadding: true, label: '#' },
            { id: 'authenType', numeric: false, disablePadding: true, label: '' },
            { id: 'authenName', numeric: false, disablePadding: true, label: 'AuthenName' },
            {
                id: 'fullControl',
                numeric: false,
                disablePadding: true,
                label: 'FullControl',
                explain: t('DirectoryManagement.PermissionCodeDetail.FullControl'),
            },
            {
                id: 'modify',
                numeric: false,
                disablePadding: false,
                label: 'Modify',
                explain: t('DirectoryManagement.PermissionCodeDetail.Modify'),
            },
            {
                id: 'write',
                numeric: false,
                disablePadding: false,
                label: 'Write',
                explain: t('DirectoryManagement.PermissionCodeDetail.Write'),
            },
            {
                id: 'readAndExecute',
                numeric: false,
                disablePadding: true,
                label: 'ReadAndExecute',
                explain: t('DirectoryManagement.PermissionCodeDetail.ReadAndExecute'),
            },
            {
                id: 'read',
                numeric: false,
                disablePadding: false,
                label: 'Read',
                explain: t('DirectoryManagement.PermissionCodeDetail.Read'),
            },
            {
                id: 'listFolderContents',
                numeric: false,
                disablePadding: false,
                label: 'ListFolderContents',
                explain: t('DirectoryManagement.PermissionCodeDetail.ListFolderContents'),
            },
            { id: 'action', numeric: false, disablePadding: false, label: '' },
        ]);
    });
});
