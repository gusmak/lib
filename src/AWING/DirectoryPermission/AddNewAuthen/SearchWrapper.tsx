import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper } from '@mui/material';
import { SearchBox } from 'AWING';
import { useAuthenMemoByKey } from '../hooks';
import { filterAuthensByName, authenHasDifference } from '../utils';
import AuthenList from '../components/AuthenList';
import { Authen, AuthenType, AuthenTypeEnum } from '../types';
import type { SearchWrapperProps } from './types';

function SearchWrapper(props: SearchWrapperProps) {
    const { t } = useTranslation();
    const { authenIds, authens, onAuthenIdsChange } = props;

    const [authensSearchResult, setAuthensByType] = useAuthenMemoByKey<Authen>();

    const keyOfAuthenType = Object.keys(AuthenTypeEnum).filter((key) => isNaN(Number(key))) as Array<keyof typeof AuthenTypeEnum>;

    /** Theo dõi sự thay đổi của Authen */
    useEffect(() => {
        keyOfAuthenType.forEach((type) => {
            const authensByType = authens[type];

            if (authenHasDifference(authensSearchResult[type], authensByType)) {
                setAuthensByType(type, authensByType);
            }
        });
    }, [authens]);

    /** Cập nhật lại trạng thái Authen theo loại */
    const handleChangeAuthenList = (authenIds: number[], type: AuthenType) => {
        onAuthenIdsChange && onAuthenIdsChange(authenIds, type);
    };

    /** Cập nhật lại danh sách authen khi tìm kiếm */
    const handleSearch = (searchString: string) => {
        keyOfAuthenType.forEach((type) => {
            const newAuthens = filterAuthensByName(authens[type], searchString);

            setAuthensByType(type, newAuthens);
        });
    };

    return (
        <Paper
            sx={(theme) => ({
                padding: 2,
                width: '100%',
                border: theme.palette.background.paper,
            })}
        >
            <SearchBox
                style={{ height: '40px', width: '100%' }}
                onSearch={(_searchType: string, searchString: string) => {
                    handleSearch(searchString);
                }}
            />

            {keyOfAuthenType.map((type) => (
                <AuthenList
                    key={type}
                    title={t(`DirectoryManagement.AuthenLabel.${type}`)}
                    authens={authensSearchResult[type]}
                    selectedAuthenIds={authenIds[type]}
                    onChangeAuthenIds={(authenIds: number[]) => handleChangeAuthenList(authenIds, type)}
                />
            ))}
        </Paper>
    );
}

export default SearchWrapper;
