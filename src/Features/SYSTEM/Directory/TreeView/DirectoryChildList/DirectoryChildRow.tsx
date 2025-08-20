import { useState } from 'react';
import { TableRow, TableCell, Typography } from '@mui/material';
import { FolderOpen as FolderOpenIcon, InsertDriveFile as InsertDriveFileIcon } from '@mui/icons-material';
import DirectoryAction from '../../components/DirectoryAction';
import type { Directory } from '../../types';

export type OwnProps = {
    directory: Directory;
    deleteDirectory?: (directoryInfo: { id: number; parentObjectId?: number }) => void;
};

function DirectoryChildRow(props: OwnProps) {
    const { directory, deleteDirectory } = props;
    const [onHovered, setOnHovered] = useState<boolean>(false);

    const handleDeleteDirectory = (id: number, parentObjectId?: number) => {
        deleteDirectory && deleteDirectory({ id, parentObjectId });
    };

    return (
        <TableRow hover tabIndex={-1} onMouseEnter={() => setOnHovered(true)} onMouseLeave={() => setOnHovered(false)}>
            <TableCell
                sx={(theme) => ({
                    width: '28px',
                    borderBottom: 'none',
                    padding: theme.spacing(0, 0, 0, 2),
                })}
            >
                {directory.isFile ? <InsertDriveFileIcon color="secondary" /> : <FolderOpenIcon color="secondary" />}
            </TableCell>
            <TableCell
                align="left"
                sx={(theme) => ({
                    wordBreak: 'break-word',
                    padding: theme.spacing(1.2, 3, 1, 0.5),
                    borderBottom: 'none',
                })}
            >
                <Typography
                    sx={{
                        minHeight: 28,
                    }}
                >
                    {directory.name}
                </Typography>
            </TableCell>
            <TableCell align="right" style={{ borderBottom: 'none' }}>
                {onHovered && (
                    <DirectoryAction
                        isFile={!!directory.isFile}
                        id={directory.id ?? -1}
                        isSystem={!!directory.isSystem}
                        deleteDirectory={() => handleDeleteDirectory(Number(directory.id), Number(directory.parentObjectId))}
                    />
                )}
            </TableCell>
        </TableRow>
    );
}

export default DirectoryChildRow;
