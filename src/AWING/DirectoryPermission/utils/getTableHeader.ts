import { TFunction } from 'i18next';
import { HeadCell } from '../components/PermissionTable';

/** @param t translator of React-i18next - useTranslation */
export function getTableHeader(t: TFunction) {
    const cells: HeadCell[] = [
        { id: 'stt', numeric: false, disablePadding: true, label: '#' },
        { id: 'authenType', numeric: false, disablePadding: true, label: '' },
        {
            id: 'authenName',
            numeric: false,
            disablePadding: true,
            label: 'AuthenName',
            explain: t('DirectoryManagement.AuthenName'),
        },
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
    ];

    return cells;
}

export const headCells: HeadCell[] = [
    { id: 'schema', numeric: false, disablePadding: true, label: '' },
    {
        id: 'fullcontrol',
        numeric: false,
        disablePadding: true,
        label: 'FullControl',
    },
    { id: 'modify', numeric: false, disablePadding: true, label: 'Modify' },
    { id: 'write', numeric: false, disablePadding: true, label: 'Write' },
    {
        id: 'readandexecute',
        numeric: false,
        disablePadding: true,
        label: 'ReadAndExecute',
    },
    { id: 'read', numeric: false, disablePadding: true, label: 'Read' },
    {
        id: 'listfoldercontents',
        numeric: false,
        disablePadding: true,
        label: 'ListFolderContents',
    },
    { id: 'action', numeric: false, disablePadding: true, label: '' },
];
