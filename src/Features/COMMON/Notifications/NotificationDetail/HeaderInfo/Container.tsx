import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Typography, Box } from '@mui/material';
import { Constants } from 'Commons/Constant';
import SearchBox from 'AWING/SearchBox';
import ButtonTabs from '../../components/ButtonTabs';
import MenuNotification from './MenuNotification';
import type { IValueItem } from '../../Types';

export type PropsHeaderInfo = {
    valueFilter: {
        textSearch: string;
        tabs: string;
    };
    onUpdateStatus: (dataSent: IValueItem | string) => void;
    onValueFilter: (textSearch: string, tabs: string) => void;
    onClosePopover?: () => void;
};

const HeaderInfo = (props: PropsHeaderInfo) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { valueFilter, onValueFilter, onUpdateStatus, onClosePopover } = props;

    const handleUpdateMenuItem = (value: string) => {
        if (value === Constants.SELECT_ALL) {
            onUpdateStatus(Constants.ALL);
        } else if (value === Constants.NOTIFICATION_SETTING_SCREEN_PATH) {
            onClosePopover && onClosePopover();
            navigate(`${value}`);
        } else {
            // Chuyển đến trang tương ứng
            navigate(`${value}`);
        }
    };

    const handleKeyWordPassing = useCallback(
        (_searchType: string, searchString: string) => {
            onValueFilter(searchString, valueFilter.tabs);
        },
        [valueFilter]
    );

    const handleUpdateTabActive = useCallback(
        (tabItem: string) => {
            onValueFilter(valueFilter.textSearch, tabItem);
        },
        [valueFilter]
    );

    return (
        <Box component="div">
            <Box
                mb={1}
                component="div"
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Typography component="h1" variant="h5" color="inherit" noWrap fontWeight={'bold'}>
                    {t('Common.Notification')}
                </Typography>
                <MenuNotification onUpdateMenuItem={handleUpdateMenuItem} />
            </Box>
            <SearchBox
                onSearch={handleKeyWordPassing}
                stylePaper={{
                    flex: 1,
                    width: 'auto',
                    maxWidth: '100%',
                }}
            />
            <ButtonTabs tabActive={valueFilter.tabs} onUpdateTabActive={handleUpdateTabActive} />
        </Box>
    );
};

export default HeaderInfo;
