import { CSSProperties, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { toNumber, cloneDeep, filter, isFunction, size, map } from 'lodash';
import { Button, InputLabel, MenuItem, FormControl, Select, IconButton, Card, CardContent, CardHeader, Grid } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ParamInput from './ParamInput';
import { type Configuration, type ParamConfiguration, SharingConfigParamType } from '../Types';

const ConfigParamStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
};

export type ParamConfigurationInputsProps = {
    configurations: Configuration[];
    configurationParams?: string[];
    paramNameFieldType: 'text' | 'select';
    paramValueFieldType: 'text' | 'select';
    onChange: (configurations: Configuration[]) => void;
    canAdd: boolean;
    configType?: SharingConfigParamType;
    title: string;
};

export default function ParamConfigurationInputs(props: ParamConfigurationInputsProps) {
    const { configurations, configurationParams, paramNameFieldType, paramValueFieldType, onChange, canAdd, configType, title } = props;

    const { t } = useTranslation();

    const dataConfigurations = [...configurations];

    const handleAppend = (_event: MouseEvent<HTMLButtonElement>) => {
        if (!canAdd && !Array.isArray(dataConfigurations)) {
            onChange(dataConfigurations);
        } else {
            const lastId = size(dataConfigurations) ? dataConfigurations[dataConfigurations.length - 1].id : 0;
            if (configurationParams && size(configurationParams)) {
                dataConfigurations.push({
                    id: toNumber(lastId) + 1,
                    paramName: configurationParams[0],
                    paramValue: '',
                    paramType: configType,
                });
            }

            onChange(dataConfigurations);
        }
    };

    const handleChangeSchemaParamKey = (id: string | number, key: string) => {
        const newConfigurations = cloneDeep(dataConfigurations);
        map(newConfigurations, (i) => {
            if (i.id === id)
                return {
                    ...i,
                    paramName: key,
                };
            else return i;
        });

        isFunction(onChange) && onChange(newConfigurations as Configuration[]);
    };

    const handleChangeParamValue = (configurations?: ParamConfiguration[]) => {
        map(cloneDeep(configurations), (c) => {
            return {
                ...c,
                paramType: configType,
            };
        });

        isFunction(onChange) && onChange(configurations as Configuration[]);
    };

    const handleDelete = (id: number | string) => {
        let newDataConfigurations = [];

        if (size(dataConfigurations) === 1) {
            newDataConfigurations = [
                {
                    ...dataConfigurations[0],
                    paramValue: undefined,
                },
            ];
        } else {
            newDataConfigurations = filter(dataConfigurations, (i) => i.id !== id);
        }
        isFunction(onChange) && onChange(newDataConfigurations as Configuration[]);
    };

    return (
        <div data-testid="param-config-input" style={ConfigParamStyles}>
            <Card elevation={3}>
                <CardHeader
                    title={title}
                    sx={{ paddingRight: '40px' }}
                    action={
                        canAdd ? (
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={handleAppend}
                                disabled={
                                    paramValueFieldType === 'select'
                                        ? configurations.length === configurations[0].paramValue?.length
                                        : false
                                }
                            >
                                {t('Common.Create')}
                            </Button>
                        ) : null
                    }
                />
                <CardContent sx={{ paddingBottom: '0 !important' }}>
                    {size(dataConfigurations)
                        ? dataConfigurations.map((config) => {
                              return (
                                  <Grid key={config.id} container pl={2} mb={2}>
                                      <Grid size={{ xs: 4 }} pr={2}>
                                          {configType === SharingConfigParamType.Schema ? (
                                              // schema param key
                                              <FormControl
                                                  variant="standard"
                                                  sx={{
                                                      m: 1,
                                                      minWidth: 120,
                                                      width: '100%',
                                                  }}
                                              >
                                                  <InputLabel id="demo-simple-select-standard-label">
                                                      {/* Param Key */}
                                                      {t('WorkspaceSharing.Label.ParamName')}
                                                  </InputLabel>
                                                  <Select
                                                      labelId="demo-simple-select-standard-label"
                                                      id="demo-simple-select-standard"
                                                      value={config.paramName}
                                                      onChange={(event: any) => handleChangeSchemaParamKey(config.id, event.target.value)}
                                                      label={t('WorkspaceSharing.Label.ParamName')}
                                                  >
                                                      {map(configurationParams, (p) => (
                                                          <MenuItem value={p}>
                                                              <em>{p}</em>
                                                          </MenuItem>
                                                      ))}
                                                  </Select>
                                              </FormControl>
                                          ) : (
                                              <ParamInput
                                                  paramType="name"
                                                  type={paramNameFieldType}
                                                  paramConfiguration={config}
                                                  configurations={dataConfigurations}
                                              />
                                          )}
                                      </Grid>
                                      <Grid
                                          size={{ xs: configType === SharingConfigParamType.Schema ? 7 : 8 }}
                                          pr={2}
                                          style={{ position: 'relative' }}
                                      >
                                          <ParamInput
                                              isRequired={configType === SharingConfigParamType.Filter ? true : false}
                                              paramType="value"
                                              type={paramValueFieldType}
                                              paramConfiguration={config}
                                              onParamChange={handleChangeParamValue}
                                              configurations={dataConfigurations}
                                          />
                                      </Grid>

                                      {/* Allowed delete schema config */}
                                      {configType === SharingConfigParamType.Schema ? (
                                          <Grid
                                              size={{ xs: 1 }}
                                              style={{
                                                  display: 'flex',
                                                  alignItems: 'end',
                                                  justifyContent: 'center',
                                              }}
                                          >
                                              <IconButton onClick={() => handleDelete(config.id)}>
                                                  <DeleteIcon />
                                              </IconButton>
                                          </Grid>
                                      ) : null}
                                  </Grid>
                              );
                          })
                        : null}
                </CardContent>
            </Card>
        </div>
    );
}
