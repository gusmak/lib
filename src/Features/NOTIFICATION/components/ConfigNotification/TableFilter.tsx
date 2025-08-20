import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import ScienceIcon from '@mui/icons-material/Science';
import {
    Box,
    Button,
    Chip,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import React, { Fragment } from 'react';
import { Channel, Detail, ITableFilter, LastPoint } from './type';
import { Link, useNavigate } from 'react-router';
import { FilterObjectState } from 'Features/NOTIFICATION/NotificationConfig/jotai';
import { useSetAtom } from 'jotai';
import { Constants } from 'Commons/Constant';
import CircularProgress from 'AWING/CircularProgress';

const TableFilter = ({
    notificationConfigDetails,
    users,
    groups,
    templates,
    loading,
    objectFilters,
    onSubmitData,
    onClickTesting,
    notificationConfigDetailPermissions,
}: ITableFilter) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const setFilterObject = useSetAtom(FilterObjectState);

    const handleChange = (newValue: Detail, index: number) => {
        let temp = [...notificationConfigDetails];
        if (newValue.channels.length < 1) {
            temp.splice(index, 1);
        } else {
            temp[index] = newValue;
        }
        onSubmitData(temp);
    };

    const handleFilterObject = (id: number) => {
        return objectFilters.find((item) => item.id === id)?.name;
    };

    const handleFormNotification = (id: number) => {
        return templates && templates.find((item) => item?.id === id)?.name;
    };

    const handleUserIds = (id: number) => {
        return users && users.find((item) => item.id === id)?.name;
    };

    const handleUserGroupIds = (id: number) => {
        return groups && groups.find((item) => item.id === id)?.name;
    };

    const handleDeleteLastPoint = (
        item: Detail,
        indexDetail: number,
        channelIndex: number,
        indexLastPoints: number
    ) => {
        let temp = { ...item };

        temp.channels[channelIndex].lastPoints.splice(indexLastPoints, 1);
        if (temp.channels[channelIndex].lastPoints.length < 1) {
            temp.channels.splice(channelIndex, 1);
        }
        handleChange(temp, indexDetail);
    };

    const renderFieldsRowSpanChild = (
        item: LastPoint,
        detail: Detail,
        indexDetail: number,
        channelIndex: number,
        lastPointIndex: number
    ) => {
        const renderChip = (label: string) => (
            <Chip key={label} style={{ marginBottom: 2, marginRight: 5 }} label={label} variant="outlined" />
        );

        const renderUserChips = (userIds: string[], labelPrefix: string) =>
            userIds.map((userId) => renderChip(`${labelPrefix}: ${handleUserIds(Number(userId))}`));

        const renderUserGroupChips = (userGroupIds: string[]) =>
            userGroupIds.map((userGroupId) =>
                renderChip(
                    `${t('NotificationConfig.ReceiverType.USER_GROUP_IDS')}: ${handleUserGroupIds(Number(userGroupId))}`
                )
            );

        return (
            <>
                <TableCell sx={{ border: '1px solid rgb(224, 224, 224)' }}>
                    {item.receiverId || item.email ? (
                        renderChip(item.receiverId ? `ChatID: ${item.receiverId}` : `Email: ${item.email}`)
                    ) : (
                        <>
                            {item.userIds &&
                                renderUserChips(item.userIds, t('NotificationConfig.ReceiverType.USER_IDS'))}
                            {item.userGroupIds && renderUserGroupChips(item.userGroupIds)}
                        </>
                    )}
                </TableCell>
                <TableCell sx={{ border: '1px solid rgb(224, 224, 224)' }}>
                    {item.templateId && handleFormNotification(Number(item.templateId))}
                </TableCell>
                <TableCell
                    sx={{
                        p: 0,
                        border: '1px solid rgb(224, 224, 224)',
                    }}
                    align="center"
                >
                    {onClickTesting && (
                        <IconButton
                            aria-label="test"
                            onClick={(e) => {
                                e.stopPropagation();
                                //chỉ test thông số lastPoint được chọn
                                let result = cloneDeep(detail);
                                let selChannel = result.channels[channelIndex];
                                selChannel = { ...selChannel, lastPoints: [selChannel.lastPoints[lastPointIndex]] };
                                result.channels = [selChannel];
                                onClickTesting(result);
                            }}
                            disabled={!notificationConfigDetailPermissions}
                        >
                            <ScienceIcon />
                        </IconButton>
                    )}
                    <IconButton
                        aria-label="delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLastPoint(detail, indexDetail, channelIndex, lastPointIndex);
                        }}
                        disabled={!notificationConfigDetailPermissions}
                    >
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </>
        );
    };

    const renderFieldsRowSpan = (
        data: Channel,
        item: Detail,
        indexDetail: number,
        channelIndex: number,
        lastPointIndex: number
    ): React.ReactNode => {
        const rowSpan = data?.lastPoints?.length || undefined;
        const firstDetail = data?.lastPoints?.[0] || [];

        return (
            <>
                <TableCell
                    sx={{
                        border: '1px solid rgb(224, 224, 224)',
                    }}
                    rowSpan={rowSpan}
                >
                    {data.channelType}
                </TableCell>

                {renderFieldsRowSpanChild(firstDetail, item, indexDetail, channelIndex, lastPointIndex)}
            </>
        );
    };

    const renderRows = (item: Detail, indexDetail: number) => {
        const rowSpan = item.channels.flatMap((i) => i.lastPoints).length || 0;
        const firstDetail = item.channels?.[0];

        return (
            <TableBody
                sx={{
                    '&:hover': {
                        background: 'rgba(0, 0, 0, 0.04)',
                    },
                }}
                key={indexDetail}
            >
                <TableRow
                    onClick={() => {
                        if (!notificationConfigDetailPermissions) return;
                        setFilterObject(Number(item.objectFilterId));
                        navigate(Constants.CONFIG_FILTER);
                    }}
                    sx={{ cursor: 'pointer' }}
                >
                    <TableCell sx={{ border: '1px solid rgb(224, 224, 224)' }} rowSpan={rowSpan}>
                        {indexDetail + 1}
                    </TableCell>
                    <TableCell sx={{ border: '1px solid rgb(224, 224, 224)' }} rowSpan={rowSpan}>
                        {handleFilterObject(item.objectFilterId)}
                    </TableCell>
                    {renderFieldsRowSpan(firstDetail, item, indexDetail, 0, 0)}
                </TableRow>

                {item.channels?.[0]?.lastPoints?.map(
                    (detail: LastPoint, idx: number) =>
                        idx > 0 && (
                            <TableRow
                                onClick={() => {
                                    if (!notificationConfigDetailPermissions) return;
                                    setFilterObject(Number(item.objectFilterId));
                                    navigate(Constants.CONFIG_FILTER);
                                }}
                                key={idx}
                                sx={{ cursor: 'pointer' }}
                            >
                                {renderFieldsRowSpanChild(detail, item, indexDetail, 0, idx)}
                            </TableRow>
                        )
                )}

                {item.channels?.slice(1).map((detail: Channel, index: number) => (
                    <Fragment key={index}>
                        <TableRow
                            onClick={() => {
                                if (!notificationConfigDetailPermissions) return;
                                setFilterObject(Number(item.objectFilterId));
                                navigate(Constants.CONFIG_FILTER);
                            }}
                            sx={{ cursor: 'pointer' }}
                        >
                            {renderFieldsRowSpan(detail, item, indexDetail, index + 1, 0)}
                        </TableRow>
                        {detail?.lastPoints.slice(1).map((a: LastPoint, idx: number) => (
                            <TableRow
                                onClick={() => {
                                    if (!notificationConfigDetailPermissions) return;
                                    setFilterObject(Number(item.objectFilterId));
                                    navigate(Constants.CONFIG_FILTER);
                                }}
                                key={idx}
                                sx={{ cursor: 'pointer' }}
                            >
                                {renderFieldsRowSpanChild(a, item, indexDetail, index + 1, idx + 1)}
                            </TableRow>
                        ))}
                    </Fragment>
                ))}
            </TableBody>
        );
    };

    return (
        <Grid container sx={{ flexGrow: 1, p: '0 24px 24px' }}>
            {loading ? (
                <Box sx={{ width: '100%' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid
                    size={{
                        xs: 12,
                    }}
                    component={Paper}
                    sx={{ p: 3 }}
                >
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {t('NotificationConfig.ListOfObject')}
                        </Typography>

                        <Button
                            component={Link}
                            variant="outlined"
                            to={Constants.CONFIG_FILTER}
                            disabled={loading || !notificationConfigDetailPermissions}
                        >
                            <Add fontSize="small" />
                            <Typography variant="body1">{t('Common.Add')}</Typography>
                        </Button>
                    </Box>

                    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" className={'tableRowSpan'}>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        align="left"
                                        width="20px"
                                        sx={{
                                            border: '1px solid rgb(224, 224, 224)',
                                        }}
                                    >
                                        {t('NotificationConfig.STT')}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid rgb(224, 224, 224)',
                                            width: '20%',
                                        }}
                                    >
                                        {t('NotificationConfig.FilterName')}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid rgb(224, 224, 224)',
                                        }}
                                    >
                                        {t('NotificationConfig.ChannelName')}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid rgb(224, 224, 224)',
                                        }}
                                    >
                                        {t('NotificationConfig.ReceivingObject')}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid rgb(224, 224, 224)',
                                        }}
                                    >
                                        {t('NotificationConfig.NotiForm')}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid rgb(224, 224, 224)',
                                            width: '82px',
                                        }}
                                    ></TableCell>
                                </TableRow>
                            </TableHead>
                            {notificationConfigDetails && notificationConfigDetails.map(renderRows)}
                            {notificationConfigDetails.length <= 0 && (
                                <TableBody>
                                    <TableRow
                                        style={{
                                            height: 53,
                                        }}
                                    >
                                        <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                                            {t('Common.NoData')}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            )}
                        </Table>
                    </TableContainer>
                </Grid>
            )}
        </Grid>
    );
};

export default TableFilter;
