import { memo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { filter, isFunction, size } from 'lodash';
import { IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import ParamConfigurationInputs from './ParamConfigurationInputs';
import ChoseWorkspace from './ChoseWorkspace';
import type { Workspace } from 'Features/SYSTEM/types';
import { type Configuration, type ParamConfiguration, SharingConfigParamType } from '../Types';

const WorkspaceSharingConfigTabStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    gap: '20px',
    padding: '20px',
    margin: '20px',
    borderRadius: '4px',
    boxShadow: '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
};

type OwnProps = {
    workspaces?: any;
    filter?: string[];
    schema?: string[];
    isCreate?: boolean;
    selectedId?: number;
    workspaceOptions?: Workspace[];
    parentFolderConfigurations?: ParamConfiguration[];
    workspaceSelectedId?: number;
    configuration: {
        filter: Configuration[];
        schema: Configuration[];
        id?: number;
    };
    onChoseWorkspace?: (id: number) => void;
    onClearWorkspace?: (id: number) => void;
    onChangeConfigurations?: (config: ParamConfiguration[], type: `${SharingConfigParamType}`) => void;
};

function AddOrEditConfig(props: OwnProps) {
    const { t } = useTranslation();
    const {
        selectedId,
        isCreate,
        workspaceOptions = [],
        configuration,
        schema,
        onChoseWorkspace,
        onClearWorkspace,
        onChangeConfigurations,
    } = props;

    /** Change one Workspace config */
    const handleChangeConfig = (config: ParamConfiguration[], type: `${SharingConfigParamType}`) => {
        isFunction(onChangeConfigurations) && onChangeConfigurations(config, type);
    };

    return (
        <div data-testid="workspace-sharing-config" style={WorkspaceSharingConfigTabStyles}>
            {onClearWorkspace && (
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                    }}
                    onClick={() => isFunction(onClearWorkspace) && onClearWorkspace(selectedId || 0)}
                >
                    <CloseIcon />
                </IconButton>
            )}

            <ChoseWorkspace
                selectedId={selectedId}
                disabled={!onChoseWorkspace || !isCreate}
                options={workspaceOptions}
                onChange={onChoseWorkspace}
            />

            {!isCreate && !size(configuration.filter) && !size(configuration.schema) ? (
                <div>{t('WorkspaceSharing.Label.EmptyParam')}</div>
            ) : null}

            {size(configuration.filter) ? (
                <ParamConfigurationInputs
                    configType={SharingConfigParamType.Filter}
                    configurations={configuration.filter}
                    paramNameFieldType="text"
                    paramValueFieldType="text"
                    onChange={(config: ParamConfiguration[]) => handleChangeConfig(config, SharingConfigParamType.Filter)}
                    canAdd={false}
                    title={t('WorkspaceSharing.Caption.Filter')}
                />
            ) : null}

            {size(configuration.schema) ? (
                <ParamConfigurationInputs
                    configType={SharingConfigParamType.Schema}
                    configurations={filter(configuration.schema, (s) => s.paramValue !== undefined) || []}
                    configurationParams={schema}
                    paramNameFieldType="select"
                    paramValueFieldType="text"
                    onChange={(config: ParamConfiguration[]) => handleChangeConfig(config, SharingConfigParamType.Schema)}
                    canAdd={true}
                    title={t('WorkspaceSharing.Caption.Schema')}
                />
            ) : null}
        </div>
    );
}

export default memo(AddOrEditConfig);
