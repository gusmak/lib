import {
    Autocomplete,
    AutocompleteProps,
    AutocompleteRenderGetTagProps,
    AutocompleteRenderGroupParams,
    AutocompleteRenderInputParams,
    Chip,
    ListSubheader,
    TextField,
} from '@mui/material';
import { IMultipleHierarchicalChoiceInput } from 'AWING/MultipleHierarchicalChoice';
import { FC, Fragment } from 'react';
export type AutocompleteOnChange = NonNullable<AutocompleteProps<IMultipleHierarchicalChoiceInput, true, false, false>['onChange']>;
interface AreaSelectFieldComponentProps {
    label: string;
    placeholder?: string;
    options: IMultipleHierarchicalChoiceInput[];
    areaSelected: IMultipleHierarchicalChoiceInput[];
    onChange: AutocompleteOnChange;
}
const renderTags = (options: IMultipleHierarchicalChoiceInput[], getTagProps: AutocompleteRenderGetTagProps) =>
    options.map((option, i) => (
        <Fragment key={i}>
            <Chip label={option.name} title={option.name} size="small" {...getTagProps({ index: i })} key={i} />
        </Fragment>
    ));
const AreaSelectFieldComponent: FC<AreaSelectFieldComponentProps> = (props) => {
    const { label, placeholder, options, areaSelected, onChange } = props;

    const renderInput = (params: AutocompleteRenderInputParams) => (
        <TextField
            {...params}
            variant="outlined"
            label={label}
            slotProps={{
                inputLabel: {
                    shrink: true,
                },
                input: {
                    ...params.InputProps,
                    placeholder: placeholder,
                },
            }}
        />
    );
    const renderGroup = (params: AutocompleteRenderGroupParams) => {
        const parent = areaSelected.find((area) => area.code === params.group);
        return [
            <ListSubheader key={params.key} color="primary" component="div" disableSticky>
                {!parent ? '' : parent.name.toUpperCase()}
            </ListSubheader>,
            params.children,
        ];
    };

    return (
        <Autocomplete
            size="small"
            data-testid="AreaSelect"
            fullWidth
            multiple
            options={options}
            onChange={onChange}
            value={areaSelected}
            getOptionLabel={(option) => option.name}
            groupBy={(option) => option.parentUnitCode}
            // getOptionSelected={(option, value) => option?.code == value?.code}
            renderGroup={renderGroup}
            renderTags={renderTags}
            renderInput={renderInput}
        />
    );
};
export default AreaSelectFieldComponent;
