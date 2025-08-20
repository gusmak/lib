import { MouseEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { IconButton, Tooltip } from '@mui/material';
import { AddBox, Edit, Delete, Settings } from '@mui/icons-material';
import { Constants } from '../../constants';

export type OwnProps = {
    id: number;
    isSystem: boolean;
    deleteDirectory: () => void;
    isFile?: boolean;
};

const Container = (props: OwnProps) => {
    const { isSystem, isFile } = props;
    const { t } = useTranslation();

    const renderButton = ({
        title,
        path,
        icon,
        type,
        onClick,
    }: {
        title: string;
        icon: ReactNode;
        path?: string;
        type?: string;
        onClick?: () => void;
    }) => {
        return (
            <Tooltip title={title}>
                <IconButton
                    component={Link}
                    size="small"
                    to={path ?? ''}
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        onClick && onClick();
                    }}
                    data-testid={`action-${type}`}
                >
                    {icon}
                </IconButton>
            </Tooltip>
        );
    };

    return (
        <div data-testid="directory-actions-root">
            {renderButton({
                title: t('Common.Permission'),
                path: `${Constants.DIRECTORY_PERMISSION}/${props.id}`,
                icon: <Settings fontSize="inherit" />,
                type: 'permission',
            })}
            {!isFile &&
                renderButton({
                    title: t('Common.Create'),
                    path: `${Constants.CREATE_PATH}/${props.id}`,
                    icon: <AddBox fontSize="inherit" />,
                    type: 'create',
                })}
            {!isSystem && (
                <>
                    {!isFile &&
                        renderButton({
                            title: t('Common.Edit'),
                            path: `${Constants.EDIT_PATH}/${props.id}`,
                            icon: <Edit fontSize="inherit" />,
                            type: 'edit',
                        })}
                    {renderButton({
                        title: t('Common.Delete'),
                        icon: <Delete fontSize="inherit" />,
                        onClick: props.deleteDirectory,
                        type: 'delete',
                    })}
                </>
            )}
        </div>
    );
};

export default Container;
