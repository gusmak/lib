import { Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Constants } from 'Commons/Constant';

export type PropsButtonTab = {
    tabActive?: string;
    onUpdateTabActive?: (tabSelected: string) => void;
};

const ButtonTabs = (props: PropsButtonTab) => {
    const { t } = useTranslation();

    const { tabActive, onUpdateTabActive } = props;

    const handleUpdateTabs = (event: React.MouseEvent<HTMLElement>) => {
        const tabSelected = event?.currentTarget?.dataset?.tabs || Constants.ALL;
        onUpdateTabActive && onUpdateTabActive(tabSelected);
    };

    return (
        <Box mt={2} component="div">
            <Button
                onClick={handleUpdateTabs}
                sx={[
                    {
                        fontSize: '14px',
                        fontWeight: 700,
                        borderRadius: '24px',
                        textTransform: 'none',
                        color: tabActive === Constants.ALL ? '#FFF' : '#000',
                        backgroundColor: tabActive === Constants.ALL ? '#ED1D25' : 'inherit',
                    },
                    {
                        '&:hover': {
                            backgroundColor: tabActive === Constants.ALL ? '#DD040C' : 'inherit',
                        },
                    },
                ]}
                data-tabs={Constants.ALL}
            >
                {t('Notification.All')}
            </Button>
            <Button
                onClick={handleUpdateTabs}
                data-tabs={Constants.UNREAD}
                sx={[
                    {
                        fontSize: '14px',
                        marginLeft: '8px',
                        fontWeight: 700,
                        borderRadius: '24px',
                        textTransform: 'none',
                        color: tabActive === Constants.UNREAD ? '#FFF' : '#000',
                        backgroundColor: tabActive === Constants.UNREAD ? '#ED1D25' : 'inherit',
                    },
                    {
                        '&:hover': {
                            backgroundColor: tabActive === Constants.UNREAD ? '#DD040C' : 'inherit',
                        },
                    },
                ]}
            >
                {t('Notification.Unread')}
            </Button>
        </Box>
    );
};

export default ButtonTabs;
