import { useEffect, useMemo, useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Grid, IconButton } from '@mui/material';
import { IFilterChange, IFilterField } from '../../interface';
import inputFactory from './InputFactory';

interface InputFieldProps {
    inputFilters: IFilterField[];
    onChange: IFilterChange;
}
export default function FieldInputComponent(props: InputFieldProps) {
    const { onChange, inputFilters } = props;
    const [isHideFieldAdvanced, setIsHideFieldAdvanced] = useState(true);
    const isHaveAdvanceField = useMemo(() => new Set(inputFilters?.map((f) => +f.isAdvanceField)).has(1), [inputFilters]);
    useEffect(() => {
        const isShouldShowAdvance = inputFilters.reduce((acc, filter) => {
            const isAdvance = +filter?.isAdvanceField;
            const hasValue = +!!filter?.value;
            const isNotEmpty = ((String(filter?.value).length - 1) >> 31) + 1;
            return acc + isAdvance * hasValue * isNotEmpty;
        }, 0);

        // if (isShouldShowAdvance) {
        //     setIsHideFieldAdvanced(!isShouldShowAdvance);
        // }
        setIsHideFieldAdvanced(!!(isShouldShowAdvance ^ 1));
    }, [inputFilters]);

    function toggleAdvanceField() {
        setIsHideFieldAdvanced((s) => !s);
    }

    return (
        <Box style={{ display: 'flex', flexDirection: 'row' }}>
            <Grid container spacing={2} width={1}>
                {inputFilters.map((filterField, index) => {
                    return (
                        <Grid
                            key={index}
                            size={filterField.style.gridSize}
                            hidden={!!(+!filterField.isAdvanceField * 0 + Number(isHideFieldAdvanced) * +filterField.isAdvanceField)}
                        >
                            {inputFactory({
                                filterField,
                                index,
                                onChange,
                            })}
                        </Grid>
                    );
                })}
            </Grid>
            {
                [
                    <div>
                        <IconButton onClick={toggleAdvanceField}>
                            <Box component={[ExpandLess, ExpandMore][+isHideFieldAdvanced]} />
                        </IconButton>
                    </div>,
                ][+!isHaveAdvanceField]
            }
        </Box>
    );
}
