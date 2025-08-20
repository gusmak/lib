import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import moment from 'moment';
import { DateRange, DefinedRange } from '../types';

type DefinedRangesProps = {
    setRange: (range: DateRange) => void;
    selectedRange: DateRange;
    ranges: DefinedRange[];
};

const isSameRange = (first: DateRange, second: DateRange) => {
    const { startDate: fStart, endDate: fEnd } = first;
    const { startDate: sStart, endDate: sEnd } = second;
    if (fStart && sStart && fEnd && sEnd) {
        return moment(fStart).isSame(sStart, 'day') && moment(fEnd).isSame(sEnd, 'day');
    }
    return false;
};

const DefinedRanges: React.FunctionComponent<DefinedRangesProps> = ({ ranges, setRange, selectedRange }: DefinedRangesProps) => (
    <List>
        {ranges.map((range, idx) => (
            <ListItem
                key={idx}
                sx={[
                    isSameRange(range, selectedRange) && {
                        backgroundColor: (theme) => theme.palette.primary.dark,
                        color: 'primary.contrastText',
                        '&:hover': {
                            color: 'inherit',
                        },
                    },
                ]}
            >
                <ListItemButton onClick={() => setRange(range)}>
                    <ListItemText
                        slotProps={{
                            primary: {
                                variant: 'body2',
                                sx: {
                                    fontWeight: isSameRange(range, selectedRange) ? 'bold' : 'normal',
                                },
                            },
                        }}
                        // primaryTypographyProps={{
                        //     variant: 'body2',
                        //     sx: {
                        //         fontWeight: isSameRange(range, selectedRange) ? 'bold' : 'normal',
                        //     },
                        // }}
                    >
                        {range.label}
                    </ListItemText>
                </ListItemButton>
            </ListItem>
        ))}
    </List>
);

export default DefinedRanges;
