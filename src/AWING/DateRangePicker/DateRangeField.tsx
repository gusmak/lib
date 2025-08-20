import { useState, useRef, useEffect, RefObject } from 'react';
import { IconButton, TextField, TextFieldProps } from '@mui/material';
import moment, { Moment } from 'moment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { formatDateRange } from './component/utils';
import { makeStyles } from '@mui/styles';

// Định nghĩa kiểu cho props của component
interface DateRangeFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
    label?: string;
    dateFormat?: string;
    onChange?: (start: Moment, end: Moment) => void;
    onClickDateRange?: (event: RefObject<HTMLInputElement | null>) => void;
    textFieldProps?: Pick<TextFieldProps, 'size' | 'fullWidth' | 'classes' | 'className' | 'sx'>;
    value?: {
        startDate: Date;
        endDate: Date;
    };
    valueDateRangePicker?: {
        startDate: Date;
        endDate: Date;
    };
}

const useStyles = makeStyles(() => ({
    outlinedInput: {
        '& .MuiOutlinedInput-input': {
            padding: '10.5px !important',
        },
        '& .MuiFormControl-marginNormal': {
            margin: '0.5rem',
        },
        '& .MuiOutlinedInput-adornedEnd': {
            paddingRight: '0.25rem',
        },
        '& .MuiAutocomplete-inputRoot': {
            padding: '0.5rem',
        },
        '& .MuiAutocomplete-endAdornment': {
            top: 'calc(50% - 19px)',
        },
        '& .MuiInputBase-input': {
            height: '1.25rem',
        },
    },
}));

const DateRangeField: React.FC<DateRangeFieldProps> = ({
    label = 'Khoảng thời gian',
    dateFormat = 'DD/MM/YYYY - DD/MM/YYYY', // Định dạng mặc định
    onChange,
    onClickDateRange,
    value,
    valueDateRangePicker,
    textFieldProps,
    ...props
}) => {
    const classes = useStyles();
    const [valueDateRangeField, setValueDateRangeField] = useState<string>(value ? formatDateRange(value) : dateFormat); // Giá trị hiện tại
    const [error, setError] = useState<boolean>(false);
    const [helperText, setHelperText] = useState<string>('');
    const oldValueRef = useRef<{
        startDay: string;
        startMonth: string;
        startYear: string;
        endDay: string;
        endMonth: string;
        endYear: string;
    }>({
        startDay: 'DD',
        startMonth: 'MM',
        startYear: 'YYYY',
        endDay: 'DD',
        endMonth: 'MM',
        endYear: 'YYYY',
    }); // Giá trị cũ cho tất cả các phần
    const inputRef = useRef<HTMLInputElement>(null); // Tham chiếu đến input

    useEffect(() => {
        // Nếu không có giá trị, đặt lại giá trị mặc định
        if (!value) {
            setValueDateRangeField(dateFormat);
        } else {
            // Nếu có giá trị, định dạng lại giá trị
            setValueDateRangeField(formatDateRange(value));
        }
    }, [value]);

    // Hàm lấy vị trí của DD, MM, YYYY cho cả hai ngày
    const getPosition = () => {
        const parts = dateFormat.split(' - ');
        const startParts = parts[0].split('/');
        const endParts = parts[1].split('/');
        return {
            startDayPos: startParts.indexOf('DD') * 3, // Vị trí DD khởi đầu
            startMonthPos: startParts.indexOf('MM') * 3, // Vị trí MM khởi đầu
            startYearPos: startParts.indexOf('YYYY') * 3, // Vị trí YYYY khởi đầu
            endDayPos: 13 + endParts.indexOf('DD') * 3, // Vị trí DD kết thúc
            endMonthPos: 13 + endParts.indexOf('MM') * 3, // Vị trí MM kết thúc
            endYearPos: 13 + endParts.indexOf('YYYY') * 3, // Vị trí YYYY kết thúc
        };
    };

    const { startDayPos, startMonthPos, startYearPos, endDayPos, endMonthPos, endYearPos } = getPosition();

    // Xử lý khi nhấp chuột để chọn phần
    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
        const input = inputRef.current;
        if (!input) return;

        const cursorPosition = (event.target as HTMLInputElement).selectionStart ?? 0;

        if (cursorPosition >= startDayPos && cursorPosition <= startDayPos + 2) {
            input.setSelectionRange(startDayPos, startDayPos + 2); // DD khởi đầu
        } else if (cursorPosition >= startMonthPos && cursorPosition <= startMonthPos + 2) {
            input.setSelectionRange(startMonthPos, startMonthPos + 2); // MM khởi đầu
        } else if (cursorPosition >= startYearPos && cursorPosition <= startYearPos + 4) {
            input.setSelectionRange(startYearPos, startYearPos + 4); // YYYY khởi đầu
        } else if (cursorPosition >= endDayPos && cursorPosition <= endDayPos + 2) {
            input.setSelectionRange(endDayPos, endDayPos + 2); // DD kết thúc
        } else if (cursorPosition >= endMonthPos && cursorPosition <= endMonthPos + 2) {
            input.setSelectionRange(endMonthPos, endMonthPos + 2); // MM kết thúc
        } else if (cursorPosition >= endYearPos) {
            input.setSelectionRange(endYearPos, endYearPos + 4); // YYYY kết thúc
        }
    };

    // Xử lý khi nhấn phím (di chuyển bôi đen bằng phím mũi tên)
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const input = inputRef.current;
        if (!input) return;

        const cursorPosition = input.selectionStart ?? 0;

        if (event.key === 'ArrowLeft') {
            if (cursorPosition >= startDayPos && cursorPosition <= startDayPos + 2) {
                input.setSelectionRange(startYearPos, startYearPos + 4); // DD khởi đầu -> YYYY khởi đầu
            } else if (cursorPosition >= startMonthPos && cursorPosition <= startMonthPos + 2) {
                input.setSelectionRange(startDayPos, startDayPos + 2); // MM khởi đầu -> DD khởi đầu
            } else if (cursorPosition >= startYearPos && cursorPosition <= startYearPos + 4) {
                input.setSelectionRange(startMonthPos, startMonthPos + 2); // YYYY khởi đầu -> MM khởi đầu
            } else if (cursorPosition >= endDayPos && cursorPosition <= endDayPos + 2) {
                input.setSelectionRange(endYearPos, endYearPos + 4); // DD kết thúc -> YYYY kết thúc
            } else if (cursorPosition >= endMonthPos && cursorPosition <= endMonthPos + 2) {
                input.setSelectionRange(endDayPos, endDayPos + 2); // MM kết thúc -> DD kết thúc
            } else if (cursorPosition >= endYearPos) {
                input.setSelectionRange(endMonthPos, endMonthPos + 2); // YYYY kết thúc -> MM kết thúc
            }
            event.preventDefault();
        } else if (event.key === 'ArrowRight') {
            if (cursorPosition >= startDayPos && cursorPosition <= startDayPos + 2) {
                input.setSelectionRange(startMonthPos, startMonthPos + 2); // DD khởi đầu -> MM khởi đầu
            } else if (cursorPosition >= startMonthPos && cursorPosition <= startMonthPos + 2) {
                input.setSelectionRange(startYearPos, startYearPos + 4); // MM khởi đầu -> YYYY khởi đầu
            } else if (cursorPosition >= startYearPos && cursorPosition <= startYearPos + 4) {
                input.setSelectionRange(endDayPos, endDayPos + 2); // YYYY khởi đầu -> DD kết thúc
            } else if (cursorPosition >= endDayPos && cursorPosition <= endDayPos + 2) {
                input.setSelectionRange(endMonthPos, endMonthPos + 2); // DD kết thúc -> MM kết thúc
            } else if (cursorPosition >= endMonthPos && cursorPosition <= endMonthPos + 2) {
                input.setSelectionRange(endYearPos, endYearPos + 4); // MM kết thúc -> YYYY kết thúc
            }
            event.preventDefault();
        }
    };

    // Xử lý khi nhập liệu
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = inputRef.current;
        if (!input) return;

        const inputValue = event.target.value;
        const cursorPosition = event.target.selectionStart ?? 0;

        // Tách giá trị hiện tại thành hai phần: start và end
        const [startPart, endPart] = valueDateRangeField.split(' - ');
        const startParts = startPart.split('/');
        const endParts = endPart.split('/');
        let startDay = startParts[dateFormat.split(' - ')[0].split('/').indexOf('DD')];
        let startMonth = startParts[dateFormat.split(' - ')[0].split('/').indexOf('MM')];
        let startYear = startParts[dateFormat.split(' - ')[0].split('/').indexOf('YYYY')];
        let endDay = endParts[dateFormat.split(' - ')[1].split('/').indexOf('DD')];
        let endMonth = endParts[dateFormat.split(' - ')[1].split('/').indexOf('MM')];
        let endYear = endParts[dateFormat.split(' - ')[1].split('/').indexOf('YYYY')];

        // Xử lý nhập liệu cho ngày khởi đầu (DD)
        if (cursorPosition >= startDayPos && cursorPosition <= startDayPos + 2) {
            const cleanInput = inputValue.slice(startDayPos, startDayPos + 2).replace(/[^0-9]/g, '');

            if (cleanInput === '') {
                startDay = 'DD';
                oldValueRef.current.startDay = 'DD';
            } else {
                const dayNum = parseInt(cleanInput);
                const oldDayNum = parseInt(oldValueRef.current.startDay.replace(/[^0-9]/g, '')) || 0;
                const combinedDay = parseInt(oldDayNum ? `${oldDayNum}${cleanInput}` : cleanInput);
                if (dayNum >= 4 && dayNum <= 9 && oldDayNum === 0) {
                    startDay = `0${dayNum}`;
                    oldValueRef.current.startDay = startDay;
                    setTimeout(() => {
                        input.setSelectionRange(startMonthPos, startMonthPos + 2); // Chuyển sang MM khi đủ 2 chữ số
                        oldValueRef.current.startDay = 'DD';
                    }, 0);
                } else if (combinedDay >= 1 && combinedDay <= 31) {
                    startDay = combinedDay.toString().padStart(2, '0');

                    oldValueRef.current.startDay = startDay;
                    // if (cleanInput.length === 1 && dayNum >= 2) {
                    //     setTimeout(() => {
                    //         input.setSelectionRange(startMonthPos, startMonthPos + 2) // Chuyển sang MM nếu nhập 2-9
                    //     }, 0)
                    // } else
                    if (Number(startDay) > 9) {
                        setTimeout(() => {
                            input.setSelectionRange(startMonthPos, startMonthPos + 2); // Chuyển sang MM khi đủ 2 chữ số
                            oldValueRef.current.startDay = 'DD';
                        }, 0);
                    } else {
                        setTimeout(() => {
                            input.setSelectionRange(startDayPos, startDayPos + 2); // Giữ bôi đen DD
                        }, 0);
                    }
                } else {
                    startDay = `0${cleanInput}`; // Nếu vượt quá 31, chỉ dùng giá trị mới với số 0 phía trước
                    oldValueRef.current.startDay = startDay;
                    setTimeout(() => {
                        input.setSelectionRange(startMonthPos, startMonthPos + 2); // Chuyển sang MM
                        oldValueRef.current.startDay = 'DD';
                    }, 0);
                }
            }
        }
        // Xử lý nhập liệu cho tháng khởi đầu (MM)
        else if (cursorPosition >= startMonthPos && cursorPosition <= startMonthPos + 2) {
            const cleanInput = inputValue.slice(startMonthPos, startMonthPos + 2).replace(/[^0-9]/g, '');
            if (cleanInput === '') {
                startMonth = 'MM';
                oldValueRef.current.startMonth = 'MM';
            } else {
                const monthNum = parseInt(cleanInput);
                const oldMonthNum = parseInt(oldValueRef.current.startMonth.replace(/[^0-9]/g, '')) || 0;
                if (monthNum >= 2 && monthNum <= 9 && oldMonthNum === 0) {
                    startMonth = `0${monthNum}`;
                    oldValueRef.current.startMonth = startMonth;
                    setTimeout(() => {
                        input.setSelectionRange(startYearPos, startYearPos + 4); // Chuyển sang YYYY khởi đầu
                        oldValueRef.current.startMonth = 'MM';
                    }, 0);
                } else if (cleanInput.length === 1 && monthNum === 1 && oldMonthNum === 0) {
                    startMonth = '01';
                    oldValueRef.current.startMonth = cleanInput;
                    setTimeout(() => {
                        input.setSelectionRange(startMonthPos, startMonthPos + 2); // Giữ bôi đen MM khởi đầu
                    }, 0);
                } else if (cleanInput.length === 1 && oldMonthNum === 1) {
                    const newMonthNum = parseInt(`${oldMonthNum}${cleanInput}`);
                    if (newMonthNum >= 10 && newMonthNum <= 12) {
                        startMonth = `${newMonthNum}`;
                        oldValueRef.current.startMonth = startMonth;
                        setTimeout(() => {
                            input.setSelectionRange(startYearPos, startYearPos + 4); // Chuyển sang YYYY khởi đầu
                            oldValueRef.current.startMonth = 'MM';
                        }, 0);
                    } else {
                        startMonth = 'MM';
                        oldValueRef.current.startMonth = 'MM';
                    }
                } else {
                    startMonth = 'MM';
                    oldValueRef.current.startMonth = 'MM';
                }
            }
        }
        // Xử lý nhập liệu cho năm khởi đầu (YYYY)
        else if (cursorPosition >= startYearPos && cursorPosition <= startYearPos + 4) {
            const cleanInput = inputValue.slice(startYearPos, startYearPos + 4).replace(/[^0-9]/g, '');
            if (cleanInput === '') {
                startYear = 'YYYY';
                oldValueRef.current.startYear = 'YYYY';
            } else {
                // const yearNum = parseInt(cleanInput);
                const oldYearNum = parseInt(oldValueRef.current.startYear.replace(/[^0-9]/g, '')) || 0;
                const combinedYear = parseInt(oldYearNum ? `${oldYearNum}${cleanInput}` : cleanInput);

                if (combinedYear >= 1 && combinedYear <= 9999) {
                    startYear = combinedYear.toString().padStart(4, '0');
                    oldValueRef.current.startYear = startYear;
                    if (startYear.length === 4 && combinedYear > 1000) {
                        setTimeout(() => {
                            input.setSelectionRange(endDayPos, endDayPos + 2); // Chuyển sang DD kết thúc
                            oldValueRef.current.startYear = 'YYYY';
                        }, 0);
                    } else {
                        setTimeout(() => {
                            input.setSelectionRange(startYearPos, startYearPos + 4); // Giữ bôi đen YYYY khởi đầu
                        }, 0);
                    }
                } else {
                    startYear = `0${cleanInput}`.padStart(4, '0'); // Nếu vượt quá 9999, dùng giá trị mới với số 0 phía trước
                    oldValueRef.current.startYear = startYear;
                    setTimeout(() => {
                        input.setSelectionRange(endDayPos, endDayPos + 2); // Chuyển sang DD kết thúc
                        oldValueRef.current.startYear = 'YYYY';
                    }, 0);
                }
            }
        }
        // Xử lý nhập liệu cho ngày kết thúc (DD)
        else if (cursorPosition >= endDayPos && cursorPosition <= endDayPos + 2) {
            const cleanInput = inputValue.slice(endDayPos, endDayPos + 2).replace(/[^0-9]/g, '');
            if (cleanInput === '') {
                endDay = 'DD';
                oldValueRef.current.endDay = 'DD';
            } else {
                // const dayNum = parseInt(cleanInput);
                const oldDayNum = parseInt(oldValueRef.current.endDay.replace(/[^0-9]/g, '')) || 0;
                const combinedDay = parseInt(oldDayNum ? `${oldDayNum}${cleanInput}` : cleanInput);

                if (combinedDay >= 1 && combinedDay <= 31) {
                    endDay = combinedDay.toString().padStart(2, '0');
                    oldValueRef.current.endDay = endDay;
                    // if (cleanInput.length === 1 && dayNum >= 2) {
                    //     setTimeout(() => {
                    //         input.setSelectionRange(
                    //             endMonthPos,
                    //             endMonthPos + 2,
                    //         ); // Chuyển sang MM nếu nhập 2-9
                    //     }, 0);
                    // } else
                    if (Number(endDay) > 9) {
                        setTimeout(() => {
                            input.setSelectionRange(endMonthPos, endMonthPos + 2); // Chuyển sang MM khi đủ 2 chữ số
                            oldValueRef.current.endDay = 'DD';
                        }, 0);
                    } else {
                        setTimeout(() => {
                            input.setSelectionRange(endDayPos, endDayPos + 2); // Giữ bôi đen DD
                        }, 0);
                    }
                } else {
                    endDay = `0${cleanInput}`; // Nếu vượt quá 31, dùng giá trị mới với số 0 phía trước
                    oldValueRef.current.endDay = endDay;
                    setTimeout(() => {
                        input.setSelectionRange(endMonthPos, endMonthPos + 2); // Chuyển sang MM
                        oldValueRef.current.endDay = 'DD';
                    }, 0);
                }
            }
        }
        // Xử lý nhập liệu cho tháng kết thúc (MM)
        else if (cursorPosition >= endMonthPos && cursorPosition <= endMonthPos + 2) {
            const cleanInput = inputValue.slice(endMonthPos, endMonthPos + 2).replace(/[^0-9]/g, '');
            if (cleanInput === '') {
                endMonth = 'MM';
                oldValueRef.current.endMonth = 'MM';
            } else {
                const monthNum = parseInt(cleanInput);
                const oldMonthNum = parseInt(oldValueRef.current.endMonth.replace(/[^0-9]/g, '')) || 0;

                if (monthNum >= 2 && monthNum <= 9 && oldMonthNum === 0) {
                    endMonth = `0${monthNum}`;
                    oldValueRef.current.endMonth = endMonth;
                    setTimeout(() => {
                        input.setSelectionRange(endYearPos, endYearPos + 4); // Chuyển sang YYYY kết thúc
                        oldValueRef.current.endMonth = 'MM';
                    }, 0);
                } else if (cleanInput.length === 1 && monthNum === 1 && oldMonthNum === 0) {
                    endMonth = '01';
                    oldValueRef.current.endMonth = cleanInput;
                    setTimeout(() => {
                        input.setSelectionRange(endMonthPos, endMonthPos + 2); // Giữ bôi đen MM kết thúc
                    }, 0);
                } else if (cleanInput.length === 1 && oldMonthNum === 1) {
                    const newMonthNum = parseInt(`${oldMonthNum}${cleanInput}`);
                    if (newMonthNum >= 10 && newMonthNum <= 12) {
                        endMonth = `${newMonthNum}`;
                        oldValueRef.current.endMonth = endMonth;
                        setTimeout(() => {
                            input.setSelectionRange(endYearPos, endYearPos + 4); // Chuyển sang YYYY kết thúc
                            oldValueRef.current.endMonth = 'MM';
                        }, 0);
                    } else {
                        endMonth = 'MM';
                        oldValueRef.current.endMonth = 'MM';
                    }
                } else {
                    endMonth = 'MM';
                    oldValueRef.current.endMonth = 'MM';
                }
            }
        }
        // Xử lý nhập liệu cho năm kết thúc (YYYY)
        else if (cursorPosition >= endYearPos) {
            const cleanInput = inputValue.slice(endYearPos, endYearPos + 4).replace(/[^0-9]/g, '');
            if (cleanInput === '') {
                endYear = 'YYYY';
                oldValueRef.current.endYear = 'YYYY';
            } else {
                // const yearNum = parseInt(cleanInput);
                const oldYearNum = parseInt(oldValueRef.current.endYear.replace(/[^0-9]/g, '')) || 0;
                const combinedYear = parseInt(oldYearNum ? `${oldYearNum}${cleanInput}` : cleanInput);

                if (combinedYear >= 1 && combinedYear <= 9999) {
                    endYear = combinedYear.toString().padStart(4, '0');
                    oldValueRef.current.endYear = endYear;

                    if (endYear.length === 4) {
                        setTimeout(() => {
                            input.setSelectionRange(endYearPos, endYearPos + 4); // Giữ bôi đen YYYY kết thúc
                        }, 0);
                    }
                } else {
                    endYear = `0${cleanInput}`.padStart(4, '0'); // Nếu vượt quá 9999, dùng giá trị mới với số 0 phía trước
                    oldValueRef.current.endYear = endYear;
                    setTimeout(() => {
                        input.setSelectionRange(endYearPos, endYearPos + 4); // Giữ bôi đen YYYY kết thúc
                    }, 0);
                }
            }
        }

        // Ghép lại chuỗi theo định dạng
        const newStartParts = Array(3);
        newStartParts[dateFormat.split(' - ')[0].split('/').indexOf('DD')] = startDay;
        newStartParts[dateFormat.split(' - ')[0].split('/').indexOf('MM')] = startMonth;
        newStartParts[dateFormat.split(' - ')[0].split('/').indexOf('YYYY')] = startYear;
        const newEndParts = Array(3);
        newEndParts[dateFormat.split(' - ')[1].split('/').indexOf('DD')] = endDay;
        newEndParts[dateFormat.split(' - ')[1].split('/').indexOf('MM')] = endMonth;
        newEndParts[dateFormat.split(' - ')[1].split('/').indexOf('YYYY')] = endYear;
        const newValue = `${newStartParts.join('/')} - ${newEndParts.join('/')}`;

        setValueDateRangeField(newValue);

        // Kiểm tra tính hợp lệ của cả hai ngày
        const [startStr, endStr] = newValue.split(' - ');
        const isStartValid = moment(startStr, 'DD/MM/YYYY', true).isValid();
        const isEndValid = moment(endStr, 'DD/MM/YYYY', true).isValid();
        if ((!isStartValid || !isEndValid) && newValue !== 'DD/MM/YYYY - DD/MM/YYYY') {
            setError(true);
            setHelperText('Ngày không hợp lệ');
        } else if (isStartValid && isEndValid && moment(startStr, 'DD/MM/YYYY').isAfter(moment(endStr, 'DD/MM/YYYY'))) {
            setError(true);
            setHelperText('Ngày kết thúc phải sau ngày khởi đầu');
        } else {
            setError(false);
            setHelperText('');
            if (onChange && isStartValid && isEndValid) {
                onChange(moment(startStr, 'DD/MM/YYYY'), moment(endStr, 'DD/MM/YYYY'));
            }
        }
    };

    useEffect(() => {
        if (valueDateRangePicker) {
            setValueDateRangeField(formatDateRange(valueDateRangePicker));
        }
    }, [valueDateRangePicker?.startDate, valueDateRangePicker?.endDate]);

    return (
        <TextField
            inputRef={inputRef}
            label={label}
            value={valueDateRangeField}
            onClick={handleClick}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            error={error}
            helperText={helperText}
            fullWidth={textFieldProps?.fullWidth ?? true}
            size={textFieldProps?.size}
            classes={textFieldProps?.classes ?? { root: classes.outlinedInput }}
            className={textFieldProps?.className ?? ''}
            sx={textFieldProps?.sx}
            slotProps={{
                input: {
                    endAdornment: (
                        <IconButton
                            size={textFieldProps?.size}
                            onClick={(e) => {
                                e.stopPropagation(); // Ngăn chặn sự kiện click lan lên TextField
                                if (inputRef.current && onClickDateRange) {
                                    onClickDateRange(inputRef);
                                }
                            }}
                            edge="end"
                        >
                            <CalendarTodayIcon />
                        </IconButton>
                    ),
                },
            }}
            {...props}
        />
    );
};

export default DateRangeField;
