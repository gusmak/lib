import { Add, Clear } from '@mui/icons-material';
import {
    Checkbox,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { emailValid } from 'AWING/ultis';
import { ChannelTypeMap, LastPointType } from 'Features/NOTIFICATION/NotificationConfig/common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReceiverProps } from './type';

export default function Receiver(props: ReceiverProps) {
    const { t } = useTranslation();
    const { lastPoint, onChange, onDelete, users, groups, templates, objectType } = props;

    const handleReceiverTypeChange = (value: string) => {
        const newValue = {
            ...lastPoint,
            type: value,
            email: '',
            userIds: [],
            userGroupIds: [],
        };
        onChange(newValue);
    };
    const [errorEmail, setErrorEmail] = useState<{
        error: boolean;
        helperText: string;
    }>({ error: false, helperText: '' });

    const handleChange = (value: string | string[], fieldName: string) => {
        let newValue = { ...lastPoint };
        if (fieldName === 'email' && typeof value === 'string') {
            const isValid = emailValid(value);
            setErrorEmail({
                error: !isValid,
                helperText: isValid ? '' : t('InvalidMessage.InvalidEmail'),
            });
            newValue = {
                ...lastPoint,
                [fieldName]: value,
            };
        } else if (fieldName === 'userGroupIds') {
            let checkMap = new Map();
            for (let i = 0; i < value.length; i++) {
                if (!checkMap.has(Number(value[i]))) {
                    checkMap.set(Number(value[i]), true);
                } else {
                    checkMap.set(Number(value[i]), true);
                    checkMap.delete(Number(value[i]));
                }
            }
            let newValueFromMap = Array.from(checkMap.keys()).map((item) => item.toString());
            newValue = {
                ...lastPoint,
                [fieldName]: newValueFromMap,
            };
        } else {
            newValue = {
                ...lastPoint,
                [fieldName]: value,
            };
        }

        onChange(newValue);
    };

    const handleNameUser = (id: number) => {
        return users && users.find((item) => item.id === id)?.name;
    };
    const handleNameGroup = (id: number) => {
        return groups && groups.find((item) => item.id === Number(id))?.name;
    };

    const renderReceiverInput = () => {
        switch (lastPoint.type) {
            case LastPointType.EMAIL:
                return (
                    <TextField
                        required
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            handleChange(e.target.value, 'email');
                        }}
                        value={lastPoint.email}
                        label={t('NotificationConfig.Email')}
                        error={errorEmail.error}
                        helperText={errorEmail.error && errorEmail.helperText}
                    />
                );
            case LastPointType.USER_IDS:
                return (
                    <FormControl style={{ marginTop: '11px' }} variant="standard" size="small" fullWidth>
                        <InputLabel size="small" id="demo-mutiple-checkbox-label">
                            {t('NotificationConfig.ReceiverType.USER_IDS')}
                        </InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={lastPoint.userIds || []}
                            onChange={(e) => {
                                handleChange(e.target.value, 'userIds');
                            }}
                            renderValue={(selected) => selected.map((x) => handleNameUser(Number(x))).join(', ')}
                        >
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    <Checkbox
                                        checked={
                                            lastPoint.userIds &&
                                            lastPoint.userIds.findIndex((item) => Number(item) === user.id) >= 0
                                        }
                                    />
                                    <ListItemText primary={user.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            case LastPointType.USER_GROUP_IDS:
                return (
                    <FormControl fullWidth variant="standard" size="small" style={{ marginTop: '11px' }}>
                        <InputLabel size="small">{t('NotificationConfig.ReceiverType.USER_GROUP_IDS')}</InputLabel>
                        <Select
                            multiple
                            value={lastPoint.userGroupIds || []}
                            onChange={(e) => {
                                handleChange(e.target.value, 'userGroupIds');
                            }}
                            renderValue={(selected) => selected.map((x) => handleNameGroup(Number(x))).join(', ')}
                        >
                            {groups.map((group) => (
                                <MenuItem key={group.id} value={group.id}>
                                    <Checkbox
                                        checked={
                                            lastPoint.userGroupIds &&
                                            lastPoint.userGroupIds.findIndex((item) => Number(item) === group.id) >= 0
                                        }
                                    />
                                    <ListItemText primary={group.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Grid
                size={{
                    xs: 2,
                }}
                sx={{
                    p: 1,
                }}
            ></Grid>
            {lastPoint.type == LastPointType.TELEGRAM ? (
                <Grid
                    size={{
                        xs: 4,
                    }}
                    sx={{
                        p: 1,
                    }}
                >
                    <TextField
                        required
                        fullWidth
                        type="number"
                        variant="standard"
                        onChange={(e) => {
                            const newValue = {
                                ...lastPoint,
                                receiverId: Number(e.target.value),
                            };
                            onChange(newValue);
                        }}
                        value={lastPoint.receiverId}
                        label={t('NotificationConfig.ChatId')}
                    />
                </Grid>
            ) : (
                <>
                    <Grid
                        size={{
                            xs: 2,
                        }}
                        sx={{
                            p: 1,
                        }}
                    >
                        <FormControl variant="standard" size="small" fullWidth style={{ marginTop: '11px' }} required>
                            <InputLabel size="small">{t('NotificationConfig.ReceiverType.Label')}</InputLabel>
                            <Select
                                value={lastPoint.type}
                                onChange={(e) => handleReceiverTypeChange(e.target.value as string)}
                            >
                                {Object.entries(LastPointType)
                                    .filter(([_key, value]) => value != LastPointType.TELEGRAM)
                                    .map(([key, value]) => (
                                        <MenuItem key={key} value={value}>
                                            {t(`NotificationConfig.ReceiverType.${key}`)}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        size={{
                            xs: 3,
                        }}
                        sx={{
                            p: 1,
                        }}
                    >
                        {renderReceiverInput()}
                    </Grid>
                </>
            )}
            <Grid
                size={{
                    xs: lastPoint.type == LastPointType.TELEGRAM ? 4 : 3,
                }}
                sx={{
                    p: 1,
                }}
            >
                <FormControl variant="standard" size="small" fullWidth style={{ marginTop: '11px' }} required>
                    <InputLabel size="small">{t('NotificationConfig.Template')}</InputLabel>
                    <Select
                        value={lastPoint.templateId?.toString() || ''}
                        onChange={(e) => {
                            let newValue = {
                                ...lastPoint,
                                templateId: Number(e.target.value),
                            };
                            onChange(newValue);
                        }}
                    >
                        {templates
                            ?.filter(
                                (template) =>
                                    (lastPoint.type == LastPointType.TELEGRAM) ==
                                        (template.channelType == ChannelTypeMap[0].value) &&
                                    template.objectType == objectType
                            )
                            ?.map((template) => (
                                <MenuItem key={template.id} value={template.id?.toString()}>
                                    {template.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid
                size={{
                    xs: 2,
                }}
                sx={{
                    p: 1,
                }}
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                }}
            >
                <IconButton size="small" disabled style={{ opacity: '0' }}>
                    <Add fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => {
                        onDelete();
                    }}
                    style={{ marginBottom: '6px' }}
                >
                    <Clear fontSize="small" />
                </IconButton>
            </Grid>
        </>
    );
}
