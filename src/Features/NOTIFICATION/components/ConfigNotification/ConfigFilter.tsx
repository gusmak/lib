import { Add, Clear } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Tooltip,
    Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Receiver from './Receiver';
import { Detail, IConfigFilter, LastPoint } from './type';
import CircularProgress from 'AWING/CircularProgress';
import { emailValid } from 'AWING/ultis';
import DrawerWrapper from 'Commons/Components/ClassicDrawer';
import { ChannelTypeMap, LastPointType, LastPointTypeObj } from 'Features/NOTIFICATION/NotificationConfig/common';
import { FilterObjectState } from 'Features/NOTIFICATION/NotificationConfig/jotai';
import { useAtom } from 'jotai';
import { cloneDeep } from 'lodash';

const ConfigFilter = ({
    loading,
    objectFilters,
    users,
    groups,
    templates,
    onChangeAddFilter,
    notificationConfigDetails,
}: IConfigFilter) => {
    const { t } = useTranslation();
    const isFirstRenderRef = useRef(false);
    const [activeStep, setActiveStep] = useState(0);
    const [readyForSubmit, setReadyForSubmit] = useState(false);

    const [filterObjectId, setFilterObjectId] = useAtom(FilterObjectState);

    // Sử dụng cloneDeep vì method find sẽ trả về reference của object,
    // khi đó phần tử được lấy ra trong notificationConfigDetails sẽ thay đổi theo
    // originalDetailState, dẫn đến việc chưa lưu mà thoát ra là đã bị thay đổi
    const originalDetailState = cloneDeep(
        notificationConfigDetails.find((item) => item.objectFilterId === filterObjectId)
    );

    const [filter, setFilter] = useState<Detail>(
        originalDetailState || {
            objectFilterId: 0,
            channels: [
                {
                    channelType: 'EMAIL',
                    lastPoints: [
                        {
                            type: LastPointType.EMAIL,
                            email: '',
                            templateId: 0,
                            userGroupIds: [],
                            userIds: [],
                        },
                    ],
                },
            ],
        }
    );

    const steps: { label: string; description: string }[] = [
        {
            label: t('NotificationConfig.FilterObject.SelectFilter'),
            description: t('NotificationConfig.FilterObject.DescriptionForSelectFilter'),
        },
        {
            label: t('NotificationConfig.FilterObject.SelectNotificationChannel'),
            description: t('NotificationConfig.FilterObject.DescriptionForSelectNotificationChannel'),
        },
    ];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChangeFilter = (value: number) => {
        setFilter({
            objectFilterId: value,
            channels: filter?.channels || [
                {
                    channelType: 'TELEGRAM',
                    lastPoints: [
                        {
                            type: LastPointType.TELEGRAM,
                            receiverId: '',
                            templateId: '',
                        },
                    ],
                },
            ],
        });
    };

    const handleAddChannel = () => {
        let temp = { ...filter };
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
        setFilter(temp);
    };

    const handleChangeChannel = (channelType: string, index: number) => {
        let temp = { ...filter };
        temp.channels[index] = {
            channelType: channelType,
            lastPoints: [LastPointTypeObj[channelType]],
        };
        setFilter(temp);
    };

    const handleDeleteChannel = (index: number) => {
        let temp = { ...filter };
        temp?.channels?.splice(index, 1);
        setFilter(temp);
    };

    const handleAddLastPoint = (channelIndex: number) => {
        let temp = { ...filter };
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
        setFilter(temp);
    };

    const handleDeleteLastPoint = (channelIndex: number, index: number) => {
        let temp = { ...filter };
        temp.channels[channelIndex].lastPoints.splice(index, 1);
        setFilter(temp);
    };

    const handleLastPointChange = (newValue: LastPoint, channelIndex: number, lastPointIndex: number) => {
        let temp = { ...filter };
        temp.channels[channelIndex].lastPoints[lastPointIndex] = newValue;
        setFilter(temp);
    };

    const handleObjectFilter = (id: number) => {
        return objectFilters.find((item) => item.id === id)?.name;
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const isValidConfigFilter = (filter: Detail) => {
        return (
            !!filter.objectFilterId &&
            filter.channels?.length > 0 &&
            filter.channels?.every((channel) => {
                return (
                    channel.lastPoints?.length > 0 &&
                    channel.lastPoints?.every((lastPoint) => {
                        let receiverValid = false;
                        switch (lastPoint.type) {
                            case LastPointType.EMAIL:
                                receiverValid = emailValid(lastPoint.email ?? '');
                                break;
                            case LastPointType.TELEGRAM:
                                receiverValid = !!lastPoint.receiverId;
                                break;
                            case LastPointType.USER_IDS:
                                receiverValid = (lastPoint.userIds?.length || 0) > 0;
                                break;
                            case LastPointType.USER_GROUP_IDS:
                                receiverValid = (lastPoint.userGroupIds?.length || 0) > 0;
                                break;
                        }
                        return receiverValid && !!lastPoint.templateId;
                    })
                );
            })
        );
    };

    // Kiểm soát việc mở/đóng button submit
    useEffect(() => {
        if (isFirstRenderRef.current === false) {
            isFirstRenderRef.current = true;
            return;
        }
        if (isValidConfigFilter(filter)) {
            setReadyForSubmit(true);
        } else {
            setReadyForSubmit(false);
        }
    }, [filter]);

    return (
        <DrawerWrapper
            title={t('NotificationConfig.ConfigFilter')}
            onSubmit={() => {
                return new Promise((resolve) => {
                    onChangeAddFilter(filter);
                    setFilterObjectId(undefined);
                    resolve(true);
                });
            }}
            onClose={() => {
                setFilterObjectId(undefined);
            }}
            disableButtonSubmit={!readyForSubmit}
        >
            {loading ? (
                <CircularProgress />
            ) : (
                <Paper
                    sx={(theme) => ({
                        padding: 2,
                        margin: '24px 8px 24px',
                        border: theme.palette.background.paper,
                    })}
                >
                    <Stepper activeStep={activeStep} orientation="vertical" data-testid="stepper">
                        {steps.map((step, index) => {
                            return (
                                <Step key={step.label}>
                                    <StepLabel
                                        style={{ cursor: 'pointer' }}
                                        optional={
                                            filter.objectFilterId && index === 0 ? (
                                                <Typography variant="caption">
                                                    {handleObjectFilter(filter.objectFilterId)}
                                                </Typography>
                                            ) : null
                                        }
                                        onClick={handleStep(index)}
                                    >
                                        {step.label}
                                    </StepLabel>
                                    <StepContent>
                                        <Box>
                                            {step.description}
                                            {index === 0 ? (
                                                <FormControl fullWidth variant="standard" size="small" required>
                                                    <InputLabel>{t('NotificationConfig.Filter')}</InputLabel>
                                                    <Select
                                                        data-testid="filter"
                                                        value={filter?.objectFilterId}
                                                        onChange={(e) => handleChangeFilter(Number(e.target.value))}
                                                    >
                                                        {objectFilters?.map((filter, _idx) => (
                                                            <MenuItem key={filter.id} value={filter.id}>
                                                                {filter.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                <Grid container sx={{ flexGrow: 1 }}>
                                                    {filter?.channels?.map((channel, channelIndex: number) => (
                                                        <React.Fragment key={channelIndex}>
                                                            <Grid
                                                                size={{
                                                                    xs: 1,
                                                                }}
                                                                p={1}
                                                            >
                                                                {channelIndex === 0 && (
                                                                    <Tooltip title={t('NotificationConfig.AddChannel')}>
                                                                        <Button
                                                                            variant="outlined"
                                                                            onClick={handleAddChannel}
                                                                            sx={{
                                                                                mt: 1,
                                                                                mr: 1,
                                                                            }}
                                                                        >
                                                                            {t('Common.Add')}
                                                                        </Button>
                                                                    </Tooltip>
                                                                )}
                                                            </Grid>
                                                            <Grid
                                                                size={{
                                                                    xs: 9,
                                                                }}
                                                                p={1}
                                                            >
                                                                <FormControl
                                                                    fullWidth
                                                                    variant="standard"
                                                                    size="small"
                                                                    required
                                                                >
                                                                    <InputLabel>
                                                                        {t('NotificationConfig.Channel')}
                                                                    </InputLabel>
                                                                    <Select
                                                                        data-testid="channel"
                                                                        value={channel.channelType}
                                                                        onChange={(e) => {
                                                                            handleChangeChannel(
                                                                                e.target.value,
                                                                                channelIndex
                                                                            );
                                                                        }}
                                                                    >
                                                                        {ChannelTypeMap.map((channel) => (
                                                                            <MenuItem
                                                                                key={channel.value}
                                                                                value={channel.value}
                                                                            >
                                                                                {channel.label}
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
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'flex-end',
                                                                }}
                                                            >
                                                                <Tooltip title={t('NotificationConfig.AddLastPoint')}>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => {
                                                                            handleAddLastPoint(channelIndex);
                                                                        }}
                                                                        style={{
                                                                            marginBottom: '6px',
                                                                        }}
                                                                    >
                                                                        <Add fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                {filter?.channels.length > 1 && (
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => {
                                                                            handleDeleteChannel(channelIndex);
                                                                        }}
                                                                        style={{
                                                                            marginBottom: '6px',
                                                                        }}
                                                                    >
                                                                        <Clear fontSize="small" />
                                                                    </IconButton>
                                                                )}
                                                            </Grid>
                                                            {channel?.lastPoints?.map((lastPoint, lastPointIndex) => (
                                                                <Receiver
                                                                    key={lastPointIndex}
                                                                    lastPoint={lastPoint}
                                                                    // Đảm bảo tất cả các phần tử trong bộ lọc có cùng objectType
                                                                    objectType={
                                                                        objectFilters.length > 0
                                                                            ? String(objectFilters[0].objectTypeCode)
                                                                            : ''
                                                                    }
                                                                    onChange={(newValue) => {
                                                                        handleLastPointChange(
                                                                            newValue,
                                                                            channelIndex,
                                                                            lastPointIndex
                                                                        );
                                                                    }}
                                                                    onDelete={() => {
                                                                        handleDeleteLastPoint(
                                                                            channelIndex,
                                                                            lastPointIndex
                                                                        );
                                                                    }}
                                                                    users={users}
                                                                    groups={groups}
                                                                    templates={templates}
                                                                />
                                                            ))}
                                                        </React.Fragment>
                                                    ))}
                                                </Grid>
                                            )}
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <div>
                                                {index === 0 ? (
                                                    <Button
                                                        data-testid="next"
                                                        disabled={!filter.objectFilterId}
                                                        variant="outlined"
                                                        onClick={() => {
                                                            handleNext();
                                                        }}
                                                        sx={{ mt: 1, mr: 1 }}
                                                    >
                                                        {t('Common.Continue')}
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        data-testid="back"
                                                        onClick={handleBack}
                                                        sx={{ mt: 1, mr: 1 }}
                                                    >
                                                        {t('Common.Back')}
                                                    </Button>
                                                )}
                                            </div>
                                        </Box>
                                    </StepContent>
                                </Step>
                            );
                        })}
                    </Stepper>
                </Paper>
            )}
        </DrawerWrapper>
    );
};

export default ConfigFilter;
