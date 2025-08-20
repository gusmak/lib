import {
    Autocomplete,
    AutocompleteRenderGetTagProps,
    AutocompleteRenderGroupParams,
    AutocompleteRenderInputParams,
    Box,
    Chip,
    IconButton,
    ListSubheader,
    TextField,
    Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { IMultipleHierarchicalChoiceInput, MultipleHierarChicalChoiceComponentProps } from './interface';

const useStyles = makeStyles({
    hideIndicator: {
        '& .MuiAutocomplete-popupIndicator': {
            opacity: 0,
        },
        '& .MuiAutocomplete-clearIndicator': {
            marginRight: '8px',
        },
    },
});

function MultipleHierarchicalChoiceComponent(props: MultipleHierarChicalChoiceComponentProps) {
    const classes = useStyles();
    const {
        open,
        label,
        currentChoice,
        placeholder,
        options,
        selected,
        onOpen,
        onClose,
        onChange,
        variant,
        error,
        helperText,
        parentTitle,
        operators,
        operator,
        onOperatorChange,
        ...others
    } = props;

    const getTagName = (tag: IMultipleHierarchicalChoiceInput) => {
        const fullTag = selected.find((s) => {
            return (s[s.length - 1] as IMultipleHierarchicalChoiceInput).code === (tag as IMultipleHierarchicalChoiceInput)?.code;
        });
        let result = '';
        fullTag?.map((t, _idx) => {
            result = `${result}${result ? ' - ' : ''}${(t as IMultipleHierarchicalChoiceInput).name}`;
            return t;
        });
        return result;
    };

    const renderTags = (options: IMultipleHierarchicalChoiceInput[], getTagProps: AutocompleteRenderGetTagProps) =>
        options.map((option, i) => (
            <Chip label={getTagName(option)} title={getTagName(option)} size="small" {...getTagProps({ index: i })} />
        ));
    const renderInput = (params: AutocompleteRenderInputParams) => (
        <Box style={{ position: 'relative' }}>
            <TextField
                {...params}
                variant={variant}
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
                error={error}
                helperText={error ? helperText : ''}
            />
            {operators?.length && (
                <IconButton
                    size="small"
                    style={{
                        position: 'absolute',
                        top: '11px',
                        right: '12px',
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        const idx = operators.findIndex((o) => o.id === operator);
                        if (idx >= 0) {
                            const result = idx < operators.length - 1 ? operators[idx + 1].id : operators[0].id;
                            onOperatorChange && onOperatorChange(result);
                        }
                    }}
                >
                    <Typography
                        variant="button"
                        style={{
                            width: '24px',
                            height: '24px',
                            fontWeight: 'bold',
                        }}
                    >
                        {operators.find((o) => o.id === operator)?.name}
                    </Typography>
                </IconButton>
            )}
        </Box>
    );
    const renderGroup = (params: AutocompleteRenderGroupParams) => {
        const parent = currentChoice[currentChoice.length - 1];
        return [
            <ListSubheader key={params.key} color="primary" component="div" disableSticky>
                {!parent ? parentTitle?.toUpperCase() || '' : parent.name.toUpperCase()}
            </ListSubheader>,
            params.children,
        ];
    };

    const getLastLevelValue = (values: IMultipleHierarchicalChoiceInput[][]) => {
        return values.map((value) => value[value.length - 1]);
    };

    return (
        <Autocomplete
            className={operator ? classes.hideIndicator : ''}
            size="small"
            fullWidth
            multiple
            autoComplete
            options={options}
            onChange={onChange}
            value={getLastLevelValue(selected)}
            getOptionLabel={(option) => (option as IMultipleHierarchicalChoiceInput).name}
            isOptionEqualToValue={(option, value) =>
                (option as IMultipleHierarchicalChoiceInput)?.code === (value as IMultipleHierarchicalChoiceInput)?.code
            }
            groupBy={(option) => (option as IMultipleHierarchicalChoiceInput).parentUnitCode}
            renderGroup={renderGroup}
            renderTags={renderTags}
            renderInput={renderInput}
            open={open}
            onOpen={onOpen}
            onClose={onClose}
            disabled={others.disabled}
        />
    );
}

export default MultipleHierarchicalChoiceComponent;
