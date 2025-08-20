import { Add, Clear } from '@mui/icons-material';
import { FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ChannelTypeMap, LastPointType } from 'Features/NOTIFICATION/NotificationConfig/common';
import Receiver from './Receiver';
import { LastPoint, RuleProps } from './type';

export default function Rule(props: RuleProps) {
    const { t } = useTranslation();
    const { objectFilters, rule, onChange, users, groups, templates, objectType } = props;

    const handleChangeFilter = (value: number) => {
        onChange({
            objectFilterId: value,
            channels: rule?.channels || [
                {
                    channelType: 'TELEGRAM',
                    lastPoints: [
                        {
                            type: LastPointType.TELEGRAM,
                            receiverId: 0,
                            templateId: 0,
                        },
                    ],
                },
            ],
        });
    };

    const handleAddChannel = () => {
        let temp = { ...rule };
        temp.channels.push({
            channelType: ChannelTypeMap[0].value,
            lastPoints: [
                {
                    type: LastPointType.TELEGRAM,
                    receiverId: 0,
                    templateId: 0,
                },
            ],
        });
        onChange(temp);
    };

    const handleChangeChannel = (channelType: string, index: number) => {
        let temp = { ...rule };
        temp.channels[index] = {
            channelType: channelType,
            lastPoints:
                channelType == ChannelTypeMap[0].value
                    ? [
                          {
                              type: LastPointType.TELEGRAM,
                              receiverId: 0,
                              templateId: 0,
                          },
                      ]
                    : [
                          {
                              type: LastPointType.EMAIL,
                              email: '',
                              templateId: 0,
                          },
                      ],
        };
        onChange(temp);
    };

    const handleDeleteChannel = (index: number) => {
        let temp = { ...rule };
        temp?.channels?.splice(index, 1);
        onChange(temp);
    };

    const handleAddLastPoint = (channelIndex: number) => {
        let temp = { ...rule };
        const type = temp.channels[channelIndex].channelType;
        if (type === ChannelTypeMap[0].value) {
            temp.channels[channelIndex].lastPoints.push({
                type: LastPointType.TELEGRAM,
                receiverId: 0,
                templateId: 0,
            } as LastPoint);
        } else {
            temp.channels[channelIndex].lastPoints.push({
                type: LastPointType.EMAIL,
                email: '',
                templateId: 0,
            } as LastPoint);
        }
        onChange(temp);
    };

    const handleDeleteLastPoint = (channelIndex: number, index: number) => {
        let temp = { ...rule };
        temp.channels[channelIndex].lastPoints.splice(index, 1);
        onChange(temp);
    };

    const handleLastPointChange = (newValue: LastPoint, channelIndex: number, lastPointIndex: number) => {
        let temp = { ...rule };
        temp.channels[channelIndex].lastPoints[lastPointIndex] = newValue;
        onChange(temp);
    };

    return (
        <Grid container sx={{ flexGrow: 1 }}>
            <Grid
                size={{
                    xs: 10,
                }}
                p={1}
            >
                <FormControl fullWidth variant="standard" size="small" required>
                    <InputLabel>{t('NotificationConfig.Filter')}</InputLabel>
                    <Select value={rule.objectFilterId} onChange={(e) => handleChangeFilter(Number(e.target.value))}>
                        {objectFilters?.map((filter, idx) => (
                            <MenuItem key={idx} value={filter.id}>
                                {filter.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid
                size={{
                    xs: 2,
                }}
                p={1}
                style={{ display: 'flex', alignItems: 'flex-end' }}
            >
                <Tooltip title={t('NotificationConfig.AddChannel')}>
                    <IconButton
                        size="small"
                        onClick={handleAddChannel}
                        disabled={!rule?.channels}
                        style={{ marginBottom: '6px' }}
                    >
                        <Add fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Grid>
            {rule?.channels?.map((channel, channelIndex: number) => (
                <>
                    <Grid
                        size={{
                            xs: 1,
                        }}
                        p={1}
                    ></Grid>
                    <Grid
                        size={{
                            xs: 9,
                        }}
                        p={1}
                    >
                        <FormControl fullWidth variant="standard" size="small" required>
                            <InputLabel>{t('NotificationConfig.Channel')}</InputLabel>
                            <Select
                                value={channel.channelType}
                                onChange={(e) => {
                                    handleChangeChannel(e.target.value, channelIndex);
                                }}
                            >
                                {ChannelTypeMap.map((channel) => (
                                    <MenuItem value={channel.value}>{channel.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        size={{
                            xs: 22,
                        }}
                        p={1}
                        style={{ display: 'flex', alignItems: 'flex-end' }}
                    >
                        <Tooltip title={t('NotificationConfig.AddLastPoint')}>
                            <IconButton
                                size="small"
                                onClick={() => {
                                    handleAddLastPoint(channelIndex);
                                }}
                                style={{ marginBottom: '6px' }}
                            >
                                <Add fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <IconButton
                            size="small"
                            onClick={() => {
                                handleDeleteChannel(channelIndex);
                            }}
                            style={{ marginBottom: '6px' }}
                        >
                            <Clear fontSize="small" />
                        </IconButton>
                    </Grid>
                    {channel?.lastPoints?.map((lastPoint, lastPointIndex) => (
                        <Receiver
                            key={lastPointIndex}
                            lastPoint={lastPoint}
                            onChange={(newValue) => {
                                handleLastPointChange(newValue, channelIndex, lastPointIndex);
                            }}
                            objectType={objectType}
                            onDelete={() => {
                                handleDeleteLastPoint(channelIndex, lastPointIndex);
                            }}
                            users={users}
                            groups={groups}
                            templates={templates}
                        />
                    ))}
                </>
            ))}
        </Grid>
    );
}
