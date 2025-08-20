import { type ChangeEvent, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { cloneDeep, isFunction, map } from 'lodash';
import { TextField } from '@mui/material';
import { type ParamConfiguration } from '../Types';

export type OwnProps = {
    paramType: 'name' | 'value';
    type: 'text' | 'select';
    paramConfiguration: ParamConfiguration;
    onRemove?: (id: string | number) => void;
    onParamChange?: (configurations?: ParamConfiguration[]) => void;
    configurations: ParamConfiguration[];
    isRequired?: boolean;
};

const ParamInput = (props: OwnProps) => {
    const { paramType, type, paramConfiguration, onParamChange, configurations, isRequired } = props;
    const { t } = useTranslation();

    const value = useMemo(() => paramConfiguration.paramValue || '', [paramConfiguration]);

    const changeValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newconfigurations = cloneDeep(configurations);
        map(newconfigurations, (c) => {
            if (`${c.id}` === `${paramConfiguration.id}`) {
                c.paramValue = e.target.value || '';
            }
        });

        isFunction(onParamChange) && onParamChange(newconfigurations as ParamConfiguration[]);
    };

    const renderParamNameInput = () => {
        if (type === 'text') {
            return (
                <TextField
                    data-testid="param-name-input"
                    autoFocus
                    label={t('WorkspaceSharing.Label.ParamName')}
                    value={paramConfiguration.paramName || ''}
                    error={false}
                    variant="standard"
                    aria-readonly={true}
                    fullWidth
                />
            );
        } else {
            return null;
        }
    };

    const renderParamValueInput = () => {
        if (type === 'text') {
            return (
                <TextField
                    id={`input-${paramConfiguration.id}`}
                    data-testid="param-value-input"
                    label={t('WorkspaceSharing.Label.ParamValue')}
                    value={value}
                    onChange={changeValue}
                    variant="standard"
                    type="text"
                    fullWidth
                    required={isRequired}
                />
            );
        } else {
            return null;
        }
    };

    return (
        <>{paramType === 'name' ? renderParamNameInput() : paramType === 'value' ? renderParamValueInput() : null}</>
    );
};

export default memo(ParamInput);
