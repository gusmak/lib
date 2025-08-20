import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { isNull } from 'lodash';
import { styled } from '@mui/material/styles';
import { Grid, Collapse, Paper, Stack, Chip, Button } from '@mui/material';
import ButtonSelect from '../ButtonSelect';
import ButtonDateRangePicker from '../ButtonDateRangePicker';
import EnhancedAutoComplete from '../EnhancedAutoComplete';
import DirectoryTree from '../DirectoryTree';
import { dateToString } from 'Helpers';
import type { ValueBase } from 'AWING/interface';
import type { MenuOption } from '../interface';
import type { DateRangeValue } from './Types';
import type {
    AdvancedSearchProps,
    BaseField,
    ASSelectField,
    ASAutocompleteField,
    ASDateRangeField,
    ASDirectoryField,
} from './Types';

const HeaderBar = styled('header')({
    px: 2,
    display: 'flex',
    borderBottom: '1px solid rgb(229, 232, 236)',
});

const GrowingDiv = styled('div')({
    flex: '1 1 auto',
});

function AdvancedSearch<FieldName extends string = string>(props: AdvancedSearchProps<FieldName>) {
    const { t } = useTranslation();
    const { expanded, value, fields, rootStyle, onChangeValue, onClear } = props;

    const handleDelete = (fieldName: FieldName) => {
        if (value) {
            const newValue = {
                ...value,
                [fieldName]: {
                    value: undefined,
                    label: undefined,
                },
            };
            onChangeValue && onChangeValue(newValue);
        }
    };

    return (
        <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ mb: 3 }} style={rootStyle}>
            <Paper>
                <Grid container>
                    <Grid size={{ xs: 12 }}>
                        <HeaderBar>
                            <GrowingDiv />
                            <Stack direction="row" spacing={1}>
                                {fields.map((fieldDef, index) => {
                                    const { type } = fieldDef;
                                    let fieldValue = value ? value[fieldDef.fieldName] : undefined;

                                    switch (type) {
                                        case 'select': {
                                            const currentField = fieldDef as BaseField<FieldName> & ASSelectField;
                                            const { fieldName, options } = currentField;

                                            const handleChange = (val: ASSelectField['value']) => {
                                                const currentOption = options?.find((x) => x.value === val);

                                                const newvalue = value
                                                    ? {
                                                          ...value,
                                                          [fieldName]: { value: val, label: currentOption?.text },
                                                      }
                                                    : undefined;

                                                onChangeValue && onChangeValue(newvalue);
                                            };

                                            const currentValue = fieldValue?.value as ASSelectField['value'];

                                            return (
                                                <ButtonSelect
                                                    key={fieldName}
                                                    elementId={fieldName}
                                                    value={currentValue}
                                                    onChangeSelected={handleChange}
                                                    options={options}
                                                    color="secondary"
                                                    style={{ minWidth: 150, ...fieldDef.style }}
                                                >
                                                    {fieldDef.label}
                                                </ButtonSelect>
                                            );
                                        }

                                        case 'autocomplete': {
                                            const currentField = fieldDef as BaseField<FieldName> & ASAutocompleteField;
                                            const { fieldName } = currentField;
                                            const currentValue = fieldValue?.value as ASAutocompleteField['value'];

                                            const handleChange = (option: MenuOption<ValueBase>) => {
                                                const newvalue = value
                                                    ? { ...value, [fieldName]: { value: option, label: option?.text } }
                                                    : { [fieldName]: { value: option, label: option?.text } };

                                                onChangeValue &&
                                                    onChangeValue(newvalue as AdvancedSearchProps['value']);
                                            };

                                            return (
                                                <EnhancedAutoComplete
                                                    key={index}
                                                    field={currentField}
                                                    value={currentValue}
                                                    onChangeValue={handleChange}
                                                    popperStyle={fieldDef.style}
                                                />
                                            );
                                        }

                                        case 'date-range': {
                                            const currentField = fieldDef as BaseField<FieldName> & ASDateRangeField;
                                            const { fieldName } = currentField;
                                            const currentValue = fieldValue?.value as ASDateRangeField['value'];
                                            const startDate =
                                                currentValue && !isNull(currentValue[0])
                                                    ? moment(currentValue[0])
                                                    : null;
                                            const endDate =
                                                currentValue && !isNull(currentValue[1])
                                                    ? moment(currentValue[1])
                                                    : null;

                                            const handleChange = (dateRange: DateRangeValue) => {
                                                const option = {
                                                    label:
                                                        dateToString(dateRange[0]) + ' - ' + dateToString(dateRange[1]),
                                                    value: [dateRange[0], dateRange[1]],
                                                };

                                                const newvalue = value
                                                    ? { ...value, [fieldName]: option }
                                                    : { [fieldName]: option };

                                                onChangeValue &&
                                                    onChangeValue(newvalue as AdvancedSearchProps['value']);
                                            };

                                            return (
                                                <ButtonDateRangePicker
                                                    key={fieldName}
                                                    dateValue={[startDate, endDate]}
                                                    onChangeDate={handleChange}
                                                    style={fieldDef.style}
                                                >
                                                    {fieldDef.label}
                                                </ButtonDateRangePicker>
                                            );
                                        }

                                        case 'directory': {
                                            const currentField = fieldDef as BaseField<FieldName> & ASDirectoryField;
                                            const { fieldName, options = [], rootId } = currentField;

                                            const handleChange = (valueId: string) => {
                                                const currentValue = options?.find((x) => x.value === valueId);

                                                const dir = {
                                                    parentObjectId: currentValue?.parentObjectId,
                                                    directoryPath: currentValue?.directoryPath,
                                                    value: currentValue?.value,
                                                    objectId: currentValue?.objectId,
                                                    text: currentValue?.text,
                                                };

                                                const newvalue = value
                                                    ? {
                                                          ...value,
                                                          [fieldName]: {
                                                              value: dir,
                                                              label: currentValue?.text,
                                                          },
                                                      }
                                                    : {
                                                          [fieldName]: {
                                                              value: dir,
                                                              label: currentValue?.text,
                                                          },
                                                      };

                                                onChangeValue &&
                                                    onChangeValue(newvalue as AdvancedSearchProps['value']);
                                            };

                                            return (
                                                <DirectoryTree
                                                    key={index}
                                                    labelSearch={fieldDef?.label ?? ''}
                                                    defaultValue=""
                                                    rootDirectoryId={rootId ? `${rootId}` : ''}
                                                    options={options}
                                                    onChange={handleChange}
                                                />
                                            );
                                        }
                                    }
                                })}
                                {onClear && (
                                    <Button
                                        onClick={onClear}
                                        color="secondary"
                                        sx={{
                                            textTransform: 'none',
                                            color: (theme) => theme.palette.text.primary,
                                            fontWeight: 'normal',
                                        }}
                                    >
                                        {t('Common.Clear')}
                                    </Button>
                                )}
                            </Stack>
                        </HeaderBar>
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ p: 1, minHeight: 50 }}>
                        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                            {fields
                                .filter((x) => x.fieldName)
                                .map((f) => {
                                    const fieldValue = value ? value[f.fieldName] : undefined;

                                    return fieldValue ? (
                                        <Chip
                                            key={f.fieldName}
                                            icon={f?.icon}
                                            label={fieldValue?.label || f.fieldName}
                                            onDelete={() => handleDelete(f.fieldName)}
                                        />
                                    ) : null;
                                })}
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </Collapse>
    );
}

export default AdvancedSearch;
