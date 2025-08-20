import {
    TextField,
    Chip,
    Checkbox,
    Typography,
    Box,
    IconButton,
    Autocomplete,
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams,
    AutocompleteRenderOptionState,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { IMultipleChoiceComponentProps, IOption } from './interface';

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

export default function MultipleChoiceComponent(props: IMultipleChoiceComponentProps) {
    const classes = useStyles();
    const {
        label,
        selected,
        options,
        onChange,
        popupOpen = true,
        onOpen,
        onClose,
        variant,
        placeholder,
        error,
        helperText,
        operators,
        operator,
        onOperatorChange,
    } = props;

    const renderTags = <T extends { name: string }>(options: T[], getTagProps: AutocompleteRenderGetTagProps) =>
        options.map((option: T, i: number) => <Chip label={option.name} title={option.name} size="small" {...getTagProps({ index: i })} />);

    const renderInput = (params: AutocompleteRenderInputParams) => (
        <Box style={{ position: 'relative' }}>
            <TextField
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
                {...params}
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

    const renderOption = (
        props: React.HTMLAttributes<HTMLLIElement> & { key: any },
        option: IOption,
        { selected }: AutocompleteRenderOptionState
    ) => {
        return (
            <Box
                {...props}
                component="li"
                key={option.id}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Checkbox color="primary" checked={selected} />
                <Typography>{option.name}</Typography>
            </Box>
        );
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
            value={selected}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderTags={renderTags}
            renderInput={renderInput}
            renderOption={renderOption}
            open={popupOpen}
            onOpen={onOpen}
            onClose={onClose}
        />
    );
}
