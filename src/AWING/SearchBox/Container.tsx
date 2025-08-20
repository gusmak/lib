import { useState, type KeyboardEvent, type ChangeEvent } from 'react';
import { Paper, IconButton, Tooltip, InputBase, Button, Divider } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import { useAppTranslation } from 'translate/useAppTranslation';
import type { SearchBoxProps, SearchType } from './interface';

const SearchBox = (props: SearchBoxProps) => {
    const { t } = useAppTranslation();
    const {
        defaultValue,
        includeSearchById,
        onlyNumberString,
        onSearch,
        onClickAdvancedSearch,
        placeholderInput,
        stylePaper = {},
        variantPaper = 'elevation',
        ...other
    } = props;

    const [searchType, setSearchType] = useState<SearchType>('searchString');
    const [value, setValue] = useState(defaultValue ?? '');

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (!onlyNumberString || !isNaN(Number(value))) {
            setValue(value);
        }
        if (!value) {
            onSearch(searchType, '');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            onSearch(searchType, value);
        }
    };

    const handleClear = () => {
        setValue('');
        onSearch(searchType, '');
    };

    const handleChangeType = () => {
        setValue('');
        /** Disable trigger search when change type  */
        setSearchType(searchType === 'searchString' ? 'id' : 'searchString');
    };

    return (
        <Paper
            variant={variantPaper}
            sx={(theme) => ({
                padding: `${theme.spacing(0.31)}  ${theme.spacing(0.5)} `,
                display: 'flex',
                alignItems: 'center',
                maxWidth: theme.spacing(45),
                marginLeft: 0,
                ...stylePaper,
            })}
        >
            <IconButton size="medium" disabled sx={{ paddingBlock: 0 }}>
                <SearchIcon fontSize="medium" />
            </IconButton>
            <InputBase
                style={{ marginLeft: '8px', flex: 1 }}
                placeholder={
                    placeholderInput ? placeholderInput : searchType === 'searchString' ? t('Common.SearchByName') : t('Common.SearchById')
                }
                type={searchType === 'searchString' ? 'text' : 'number'}
                inputProps={{ 'aria-label': 'search' }}
                value={value}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e)}
                {...other}
            />
            {value && (
                <Tooltip title={t('Common.Clear').toString()}>
                    <IconButton size="small" onClick={() => handleClear()} style={{ color: '#ED1D25' }}>
                        <ClearIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
            {includeSearchById && (
                <Tooltip title={searchType === 'searchString' ? t('Common.SearchById').toString() : t('Common.SearchByName').toString()}>
                    <Button size="small" style={{ minWidth: 30, color: '#ED1D25' }} color="secondary" onClick={() => handleChangeType()}>
                        {searchType === 'searchString' ? 'ID' : 'N'}
                    </Button>
                </Tooltip>
            )}
            {onClickAdvancedSearch && (
                <>
                    <Divider style={{ height: 28, margin: 0.5 }} orientation="vertical" />
                    <Tooltip title={t('Common.AdvancedSearch').toString()}>
                        <IconButton size="small" onClick={() => onClickAdvancedSearch()} style={{ color: '#ED1D25' }}>
                            <MoreHorizIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </>
            )}
        </Paper>
    );
};
export default SearchBox;
