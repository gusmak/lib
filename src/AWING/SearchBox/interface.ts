import { InputBaseProps } from '@mui/material/InputBase';

export type SearchType = 'searchString' | 'id';

export interface SearchBoxProps extends InputBaseProps {
    defaultValue?: string;
    includeSearchById?: boolean;
    onlyNumberString?: boolean;
    onSearch: (searchType: SearchType, searchString: string) => void;
    placeholderInput?: string;
    onClickAdvancedSearch?(): void;

    /*
     * Style cho Paper của inputSearch
     */
    stylePaper?: object;

    /*
     * Định dạng 'variant' cho Paper của inputSearch
     */
    variantPaper?: 'elevation' | 'outlined';
}
