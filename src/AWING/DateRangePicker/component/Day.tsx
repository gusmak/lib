import { IconButton, Typography, Box, alpha } from '@mui/material';

interface DayProps {
    filled?: boolean;
    outlined?: boolean;
    highlighted?: boolean;
    hovered?: boolean; // Thêm prop mới cho trạng thái hover
    disabled?: boolean;
    startOfRange?: boolean;
    endOfRange?: boolean;
    isFirstDayOfWeek?: boolean; // Ngày đầu tuần
    isLastDayOfWeek?: boolean; // Ngày cuối tuần
    onClick?: () => void;
    onHover?: () => void;
    value: number | string;
    hidden?: boolean;
    hideOutsideMonthDays?: boolean;
}

const Day: React.FunctionComponent<DayProps> = ({
    startOfRange,
    endOfRange,
    disabled,
    highlighted,
    hovered,
    outlined,
    filled,
    isFirstDayOfWeek,
    isLastDayOfWeek,
    onClick,
    onHover,
    value,
    hidden,
    hideOutsideMonthDays = true,
}: DayProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                borderRadius: startOfRange
                    ? '50% 0 0 50%'
                    : endOfRange
                      ? '0 50% 50% 0'
                      : isFirstDayOfWeek
                        ? '50% 0 0 50%'
                        : isLastDayOfWeek
                          ? '0 50% 50% 0'
                          : undefined,
                '&:hover':
                    highlighted && !hovered
                        ? {}
                        : {
                              borderRadius: '0 50% 50% 0',
                          },
                backgroundColor: (theme) => {
                    if (disabled) return undefined;
                    if (highlighted && !hovered) return alpha(theme.palette.primary.main, 0.2); // Màu nhạt hơn cho highlighted
                    // Removed background for hover state
                    return undefined;
                },
                borderTop: (theme) => {
                    if (!disabled && hovered) return `1px dashed ${theme.palette.secondary.main}`;
                    return undefined;
                },
                borderBottom: (theme) => {
                    if (!disabled && hovered) return `1px dashed ${theme.palette.secondary.main}`;
                    return undefined;
                },
            }}
        >
            <IconButton
                sx={{
                    height: '36px',
                    width: '36px',
                    padding: 0,
                    border: (theme) => {
                        if (!disabled && outlined) return `1px solid ${theme.palette.primary.dark}`;
                        if (!disabled && hovered) return undefined;
                        return undefined;
                    },
                    ...(!disabled && filled
                        ? {
                              '&:hover': {
                                  backgroundColor: (theme) => theme.palette.primary.main,
                              },
                              backgroundColor: (theme) => theme.palette.primary.main,
                          }
                        : {}),
                }}
                disabled={disabled}
                onClick={onClick}
                onMouseOver={onHover}
                // size="large"
            >
                <Typography
                    sx={{
                        visibility: hidden && hideOutsideMonthDays ? 'hidden' : 'visible',
                        lineHeight: 1.6,
                        color: (theme) =>
                            !disabled
                                ? filled
                                    ? theme.palette.primary.contrastText
                                    : theme.palette.text.primary
                                : theme.palette.text.secondary,
                    }}
                    variant="body2"
                >
                    {value}
                </Typography>
            </IconButton>
        </Box>
    );
};

export default Day;
