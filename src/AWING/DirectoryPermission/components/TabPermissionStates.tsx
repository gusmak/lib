import { Tab, Tabs, Box } from '@mui/material';
import { BORDER_LIGHTGRAY } from '../constants';

export type TabPermissionStatesProps = {
    isShow?: boolean;
    hasBorderBottom?: boolean;
    style?: React.CSSProperties;
    tabOptions?: { key?: string; value?: string }[];
    tabValue?: string;
    onChangeTab?: (value: string) => void;
};

function TabPermissionStates(props: TabPermissionStatesProps) {
    const { isShow = false, hasBorderBottom, style, tabValue = '', tabOptions = [], onChangeTab } = props;

    const handleChangeTab = (_e: React.SyntheticEvent, newValue: string) => onChangeTab && onChangeTab(newValue);

    return (
        isShow &&
        tabValue !== '' && (
            <Box
                sx={{
                    border: hasBorderBottom ? 'none' : BORDER_LIGHTGRAY,
                    borderBottom: hasBorderBottom ? BORDER_LIGHTGRAY : 'none',
                    borderRadius: '4px 4px 0px 0px',
                    width: '100%',
                }}
                style={style}
            >
                {/* Tabs */}
                <Tabs value={tabValue} onChange={handleChangeTab}>
                    {tabOptions.map((o, idx) => (
                        <Tab key={idx} label={o.value} value={o.key} />
                    ))}
                </Tabs>
            </Box>
        )
    );
}

export default TabPermissionStates;
